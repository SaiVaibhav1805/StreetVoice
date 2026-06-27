const cron = require('node-cron');
const Issue = require('../models/Issue');

// Every hour — auto-escalate verified issues that are 24h old
const startEscalationJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const escalated = await Issue.updateMany(
        {
          status: 'verified',
          updatedAt: { $lt: cutoff }
        },
        { $set: { status: 'assigned' } }
      );

      if (escalated.modifiedCount > 0) {
        console.log(`[EscalationJob] Escalated ${escalated.modifiedCount} issues`);
      }
    } catch (err) {
      console.error('[EscalationJob] Error:', err);
    }
  });
};

module.exports = startEscalationJob;