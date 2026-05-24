const Project = require('../models/Project');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess } = require('../utils/response');

/* ─── Dashboard stats ─────────────────────────────────────────── */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Return mock data for demo users
    if (userId === 'demo-user-001') {
      return sendSuccess(res, {
        stats: {
          totalProjects: 12,
          activeProjects: 8,
          wordsGenerated: 94250,
          aiRequests: 347,
          revenue: 12480,
          users: 2847,
          growthRate: 12.5,
          successRate: 98.2,
        },
        recentActivity: [],
      });
    }

    const [totalProjects, activeProjects, recentActivity] = await Promise.all([
      Project.countDocuments({ owner: userId }),
      Project.countDocuments({ owner: userId, status: 'active' }),
      ActivityLog.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
    ]);

    sendSuccess(res, {
      stats: {
        totalProjects,
        activeProjects,
        wordsGenerated: 0,
        aiRequests: 0,
        growthRate: 0,
        successRate: 100,
      },
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Activity feed ───────────────────────────────────────────── */
exports.getActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    if (userId === 'demo-user-001') {
      return sendSuccess(res, { activity: [] });
    }

    const activity = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    sendSuccess(res, { activity });
  } catch (err) {
    next(err);
  }
};
