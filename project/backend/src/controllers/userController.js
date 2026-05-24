const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/response');

/* ─── Get profile ─────────────────────────────────────────────── */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found.', 404);
    sendSuccess(res, { user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

/* ─── Update profile ──────────────────────────────────────────── */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'location', 'website', 'bio', 'preferences', 'notifications'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    // Handle email change separately (would need re-verification in prod)
    if (req.body.email && req.body.email !== req.user.email) {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) return sendError(res, 'Email already in use.', 400);
      updates.email = req.body.email;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    await ActivityLog.create({
      user: req.user._id,
      type: 'profile',
      action: 'update',
      description: 'Profile updated',
      ipAddress: req.ip,
    });

    sendSuccess(res, { user: user.toPublic() }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/* ─── Change password ─────────────────────────────────────────── */
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) return sendError(res, 'Current password is incorrect.', 401);

    user.password = req.body.newPassword;
    await user.save();

    await ActivityLog.create({
      user: req.user._id,
      type: 'auth',
      action: 'password_change',
      description: 'Password changed',
      ipAddress: req.ip,
    });

    sendSuccess(res, {}, 'Password updated successfully.');
  } catch (err) {
    next(err);
  }
};

/* ─── Upload avatar (mock) ────────────────────────────────────── */
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400);
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );
    sendSuccess(res, { avatar: avatarUrl, user: user.toPublic() }, 'Avatar uploaded successfully.');
  } catch (err) {
    next(err);
  }
};

/* ─── Get all users (admin) ───────────────────────────────────── */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    sendSuccess(res, {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Delete account ──────────────────────────────────────────── */
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    sendSuccess(res, {}, 'Account deactivated successfully.');
  } catch (err) {
    next(err);
  }
};
