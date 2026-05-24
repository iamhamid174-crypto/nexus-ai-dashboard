const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

/* ─── Get notifications ───────────────────────────────────────── */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (userId === 'demo-user-001') {
      return sendSuccess(res, {
        notifications: [
          { _id: 'n1', type: 'success', title: 'Welcome to SAAS Dashboard!', message: 'Your account is ready.', isRead: false, createdAt: new Date() },
          { _id: 'n2', type: 'billing', title: 'Payment Successful', message: 'Pro plan activated.', isRead: false, createdAt: new Date(Date.now() - 3600000) },
          { _id: 'n3', type: 'project', title: 'Project Updated', message: 'Dashboard Redesign is 75% complete.', isRead: true, createdAt: new Date(Date.now() - 86400000) },
        ],
        unreadCount: 2,
      });
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    sendSuccess(res, { notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

/* ─── Mark one as read ────────────────────────────────────────── */
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return sendError(res, 'Notification not found.', 404);
    sendSuccess(res, { notification }, 'Marked as read.');
  } catch (err) {
    next(err);
  }
};

/* ─── Mark all as read ────────────────────────────────────────── */
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    sendSuccess(res, {}, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

/* ─── Delete notification ─────────────────────────────────────── */
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    sendSuccess(res, {}, 'Notification deleted.');
  } catch (err) {
    next(err);
  }
};
