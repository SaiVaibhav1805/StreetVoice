const Issue = require('../models/Issue');
const User = require('../models/User');

const getPublicDashboard = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalIssues,
      resolvedIssues,
      thisMonthIssues,
      thisMonthResolved,
      statusBreakdown,
      categoryBreakdown,
      severityBreakdown,
      topWards,
      topReporters,
      recentResolved,
      dailyTrend
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'resolved' }),
      Issue.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Issue.countDocuments({ status: 'resolved', resolvedAt: { $gte: thirtyDaysAgo } }),

      Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Issue.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),

      Issue.aggregate([
        { $group: { _id: '$location.ward', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),

      User.find()
        .sort({ issuesReported: -1 })
        .limit(5)
        .select('name ward issuesReported xp badges'),

      Issue.find({ status: 'resolved' })
        .sort({ resolvedAt: -1 })
        .limit(5)
        .select('title category resolvedAt location'),

      // Daily trend last 7 days
      Issue.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Avg resolution time
    const resolvedWithTime = await Issue.find({
      status: 'resolved',
      resolvedAt: { $exists: true }
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedWithTime.length > 0) {
      const totalHours = resolvedWithTime.reduce((sum, i) => {
        return sum + ((new Date(i.resolvedAt) - new Date(i.createdAt)) / 3600000);
      }, 0);
      avgResolutionHours = Math.round(totalHours / resolvedWithTime.length);
    }

    res.status(200).json({
      success: true,
      dashboard: {
        summary: {
          totalIssues,
          resolvedIssues,
          thisMonthIssues,
          thisMonthResolved,
          resolutionRate: totalIssues > 0
            ? Math.round((resolvedIssues / totalIssues) * 100)
            : 0,
          avgResolutionHours
        },
        statusBreakdown,
        categoryBreakdown,
        severityBreakdown,
        topWards,
        topReporters,
        recentResolved,
        dailyTrend
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getPublicDashboard };