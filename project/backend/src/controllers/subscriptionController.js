const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

const PLAN_PRICES = { starter: 0, pro: 29, enterprise: 99 };
const PLAN_LIMITS = {
  starter: { wordsLimit: 5000, projectsLimit: 2 },
  pro: { wordsLimit: 100000, projectsLimit: -1 },
  enterprise: { wordsLimit: -1, projectsLimit: -1 },
};

/* ─── Get subscription ────────────────────────────────────────── */
exports.getSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (userId === 'demo-user-001') {
      return sendSuccess(res, {
        subscription: {
          plan: 'pro',
          status: 'active',
          billing: 'monthly',
          price: 29,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          usage: { wordsGenerated: 47200, wordsLimit: 100000, projectsCount: 8, projectsLimit: -1 },
          invoices: [],
        },
      });
    }

    let subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      subscription = await Subscription.create({ user: userId, plan: 'starter' });
    }

    sendSuccess(res, { subscription });
  } catch (err) {
    next(err);
  }
};

/* ─── Update plan ─────────────────────────────────────────────── */
exports.updatePlan = async (req, res, next) => {
  try {
    const { plan, billing = 'monthly' } = req.body;

    if (!['starter', 'pro', 'enterprise'].includes(plan)) {
      return sendError(res, 'Invalid plan.', 400);
    }

    const price = billing === 'annual'
      ? Math.round(PLAN_PRICES[plan] * 0.8)
      : PLAN_PRICES[plan];

    const limits = PLAN_LIMITS[plan];

    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user._id },
      {
        plan, billing, price, status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (billing === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
        'usage.wordsLimit': limits.wordsLimit,
        'usage.projectsLimit': limits.projectsLimit,
      },
      { new: true, upsert: true }
    );

    // Sync plan to user
    await User.findByIdAndUpdate(req.user._id, { plan });

    sendSuccess(res, { subscription }, `Plan updated to ${plan}.`);
  } catch (err) {
    next(err);
  }
};

/* ─── Cancel subscription ─────────────────────────────────────── */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user._id },
      { cancelAtPeriodEnd: true, status: 'cancelled' },
      { new: true }
    );
    sendSuccess(res, { subscription }, 'Subscription will cancel at period end.');
  } catch (err) {
    next(err);
  }
};
