const cron = require('node-cron');
const Issue = require('../models/Issue');

// Every day at 9am — log stale issues for authority attention
const startReminderJob = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000); // 3 days

      const staleIssues = await Issue.find({
        status: { $in: ['reported', 'verified'] },
        createdAt: { $lt: cutoff }
      }).select('title status createdAt location');

      console.log(`[ReminderJob] ${staleIssues.length} stale issues need attention`);
      // In production: send push notifications or email to authorities here

    } catch (err) {
      console.error('[ReminderJob] Error:', err);
    }
  });
};

module.exports = startReminderJob;