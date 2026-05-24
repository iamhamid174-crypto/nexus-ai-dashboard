const crypto = require('crypto');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const ActivityLog = require('../models/ActivityLog');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/* ─── Register ────────────────────────────────────────────────── */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 'Email already registered.', 400);

    const user = await User.create({ name, email, password });

    // Create default starter subscription
    await Subscription.create({ user: user._id, plan: 'starter', price: 0 });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      type: 'auth',
      action: 'register',
      description: 'Account created',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

/* ─── Login ───────────────────────────────────────────────────── */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendError(res, 'Invalid credentials.', 401);
    if (!user.isActive) return sendError(res, 'Account deactivated. Contact support.', 403);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return sendError(res, 'Invalid credentials.', 401);

    user.lastLogin = Date.now();
    await user.save({ validateModifiedOnly: true });

    await ActivityLog.create({
      user: user._id,
      type: 'auth',
      action: 'login',
      description: 'User logged in',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/* ─── Logout ──────────────────────────────────────────────────── */
exports.logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  sendSuccess(res, {}, 'Logged out successfully.');
};

/* ─── Get current user ────────────────────────────────────────── */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found.', 404);
    sendSuccess(res, { user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

/* ─── Forgot password ─────────────────────────────────────────── */
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Always return success to prevent user enumeration
    if (!user) {
      return sendSuccess(res, {}, 'If that email exists, a reset link has been sent.');
    }

    const rawToken = user.getResetPasswordToken();
    await user.save({ validateModifiedOnly: true });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;
    const html = `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
        <h2 style="color:#6366f1">AI SAAS Dashboard - Password Reset</h2>
        <p>You requested a password reset. Click the link below (valid for 10 minutes):</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;border-radius:8px;text-decoration:none;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#999;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({ to: user.email, subject: 'AI SAAS Dashboard - Password Reset Request', html });
    } catch (emailErr) {
      logger.error(`Failed to send reset email: ${emailErr.message}`);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateModifiedOnly: true });
      return sendError(res, 'Email could not be sent.', 500);
    }

    sendSuccess(res, {}, 'If that email exists, a reset link has been sent.');
  } catch (err) {
    next(err);
  }
};

/* ─── Reset password ──────────────────────────────────────────── */
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) return sendError(res, 'Invalid or expired reset token.', 400);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
