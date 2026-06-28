import cron from 'node-cron';
import Issue from '../models/Issue.js';
import { generateInsight } from '../services/aiService.js';

// Every Sunday midnight — generate weekly insights
const startPredictionJob = () => {
  cron.schedule('0 0 * * 0', async () => {
    try {
      console.log('[PredictionJob] Generating weekly insights...');

      const stats = await Issue.aggregate([
        {
          $group: {
            _id: { category: '$category', ward: '$location.ward' },
            count: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      const insights = await generateInsight(stats);
      console.log('[PredictionJob] Insights generated:', insights.length);

    } catch (err) {
      console.error('[PredictionJob] Error:', err);
    }
  });
};

export default startPredictionJob;