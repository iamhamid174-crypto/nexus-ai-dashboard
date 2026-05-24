// ─── dashboard.js ─────────────────────────────────────────────────────────────
const express = require('express');
const dashRouter = express.Router();
const { protect } = require('../middleware/auth');
const { getStats, getActivity } = require('../controllers/dashboardController');

dashRouter.use(protect);
dashRouter.get('/stats', getStats);
dashRouter.get('/activity', getActivity);

// ─── analytics.js ─────────────────────────────────────────────────────────────
const analyticsRouter = express.Router();
const { getAnalytics, exportReport } = require('../controllers/analyticsController');

analyticsRouter.use(protect);
analyticsRouter.get('/', getAnalytics);
analyticsRouter.post('/export', exportReport);

// ─── projects.js ──────────────────────────────────────────────────────────────
const projectsRouter = express.Router();
const { validate, projectRules } = require('../middleware/validators');
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
} = require('../controllers/projectController');

projectsRouter.use(protect);
projectsRouter.route('/').get(getProjects).post(projectRules, validate, createProject);
projectsRouter.route('/:id').get(getProject).put(projectRules, validate, updateProject).delete(deleteProject);

// ─── notifications.js ─────────────────────────────────────────────────────────
const notificationsRouter = express.Router();
const {
  getNotifications, markAsRead, markAllAsRead, deleteNotification,
} = require('../controllers/notificationController');

notificationsRouter.use(protect);
notificationsRouter.get('/', getNotifications);
notificationsRouter.put('/read-all', markAllAsRead);
notificationsRouter.put('/:id/read', markAsRead);
notificationsRouter.delete('/:id', deleteNotification);

// ─── subscriptions.js ─────────────────────────────────────────────────────────
const subscriptionsRouter = express.Router();
const {
  getSubscription, updatePlan, cancelSubscription,
} = require('../controllers/subscriptionController');

subscriptionsRouter.use(protect);
subscriptionsRouter.get('/', getSubscription);
subscriptionsRouter.put('/plan', updatePlan);
subscriptionsRouter.put('/cancel', cancelSubscription);

module.exports = { dashRouter, analyticsRouter, projectsRouter, notificationsRouter, subscriptionsRouter };
