const { sendSuccess } = require('../utils/response');

const generateMonthlyData = (base, variance) =>
  Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    value: Math.round(base + (Math.random() - 0.3) * variance),
  }));

/* ─── Analytics overview ──────────────────────────────────────── */
exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;

    const revenueData = [
      { month: 'Jul', revenue: 6200, expenses: 2100 },
      { month: 'Aug', revenue: 7400, expenses: 2300 },
      { month: 'Sep', revenue: 8100, expenses: 2600 },
      { month: 'Oct', revenue: 9200, expenses: 2800 },
      { month: 'Nov', revenue: 10400, expenses: 3100 },
      { month: 'Dec', revenue: 12480, expenses: 3400 },
    ];

    const userGrowthData = [
      { month: 'Jul', users: 1200, newUsers: 180 },
      { month: 'Aug', users: 1450, newUsers: 250 },
      { month: 'Sep', users: 1680, newUsers: 230 },
      { month: 'Oct', users: 2010, newUsers: 330 },
      { month: 'Nov', users: 2420, newUsers: 410 },
      { month: 'Dec', users: 2847, newUsers: 427 },
    ];

    const trafficSources = [
      { name: 'Organic Search', value: 38, color: '#6366f1' },
      { name: 'Direct', value: 24, color: '#8b5cf6' },
      { name: 'Social Media', value: 20, color: '#06b6d4' },
      { name: 'Referral', value: 12, color: '#10b981' },
      { name: 'Email', value: 6, color: '#f59e0b' },
    ];

    const aiToolPerformance = [
      { tool: 'Content Gen', requests: 1240, avgTime: 2.1 },
      { tool: 'Email Gen', requests: 890, avgTime: 1.8 },
      { tool: 'Social Media', requests: 760, avgTime: 1.4 },
      { tool: 'Code Assist', requests: 540, avgTime: 3.2 },
      { tool: 'Image Prompt', requests: 320, avgTime: 0.9 },
    ];

    sendSuccess(res, {
      period,
      revenueData,
      userGrowthData,
      trafficSources,
      aiToolPerformance,
      summary: {
        totalRevenue: 12480,
        revenueGrowth: 12.5,
        totalUsers: 2847,
        userGrowth: 20.1,
        totalRequests: 3750,
        requestGrowth: 8.3,
        avgResponseTime: 1.88,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Report export (mock) ────────────────────────────────────── */
exports.exportReport = async (req, res, next) => {
  try {
    sendSuccess(res, {
      downloadUrl: '/api/analytics/report.csv',
      generatedAt: new Date().toISOString(),
    }, 'Report queued for generation.');
  } catch (err) {
    next(err);
  }
};
