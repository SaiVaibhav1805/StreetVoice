import Issue from '../models/Issue.js';

export const getStats = async (req, res, next) => {
  try {
    const totalReported = await Issue.countDocuments();
    const totalResolved = await Issue.countDocuments({ status: 'resolved' });
    const totalActive = await Issue.countDocuments({ status: { $in: ['pending', 'verified', 'in progress'] } });
    
    // Average resolution time mockup calculation
    const resolvedIssues = await Issue.find({ status: 'resolved' });
    let totalResponseTime = 0;
    
    resolvedIssues.forEach(issue => {
      const start = new Date(issue.createdAt);
      const endHistory = issue.history.find(h => h.status === 'resolved');
      const end = endHistory ? new Date(endHistory.createdAt) : new Date(issue.updatedAt);
      totalResponseTime += Math.abs(end - start) / 36e5; // hours
    });

    const averageResolutionTime = resolvedIssues.length > 0 
      ? Math.round(totalResponseTime / resolvedIssues.length) 
      : 36; // fallback 36 hours

    const verificationRate = totalReported > 0 
      ? Math.round(((totalReported - await Issue.countDocuments({ status: 'rejected' })) / totalReported) * 100)
      : 100;

    res.json({
      totalReported,
      totalResolved,
      totalActive,
      averageResolutionTime,
      verificationRate,
    });
  } catch (error) {
    next(error);
  }
};

export const getWardReports = async (req, res, next) => {
  try {
    const wardStats = await Issue.aggregate([
      {
        $group: {
          _id: '$ward',
          reported: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(wardStats);
  } catch (error) {
    next(error);
  }
};

export default { getStats, getWardReports };
