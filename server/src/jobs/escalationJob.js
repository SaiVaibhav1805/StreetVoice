import Issue from '../models/Issue.js';

/**
 * Periodically escalates issues that have been verified but remain unresolved beyond threshold time (e.g. 5 days)
 */
export const runEscalationJob = async () => {
  console.log('[Escalation Job] Running periodic check for lagging issues...');
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 5);

    const laggingIssues = await Issue.find({
      status: 'verified',
      updatedAt: { $lte: thresholdDate },
    });

    for (const issue of laggingIssues) {
      issue.history.push({
        status: 'in progress',
        comments: 'System Auto-escalation: Issue escalated to Senior Municipal Commissioner due to resolution delay.',
      });
      issue.status = 'in progress';
      await issue.save();
      console.log(`[Escalation Job] Escalated issue: ${issue.title} (${issue._id})`);
    }
  } catch (error) {
    console.error('[Escalation Job] Error running job:', error.message);
  }
};

export default { runEscalationJob };
