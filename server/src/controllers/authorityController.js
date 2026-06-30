import Issue from '../models/Issue.js';
import StatusUpdate from '../models/StatusUpdate.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// GET /api/authority/issues — all issues for authority view
export const getAllIssues = async (req, res) => {
  try {
    const {
      status, category, severity,
      ward, page = 1, limit = 20
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (ward) query['location.ward'] = new RegExp(ward, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate('reportedBy', 'name phone ward')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      issues,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error('Authority fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch issues' });
  }
};

// PATCH /api/authority/issues/:id/status — update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, note, estimatedResolution } = req.body;
    const issueId = req.params.id;

    const validStatuses = ['reported', 'verified', 'assigned', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const previousStatus = issue.status;

    // Create status update record
    await StatusUpdate.create({
      issue: issueId,
      updatedBy: req.user.userId,
      previousStatus,
      newStatus: status,
      note: note || '',
      estimatedResolution: estimatedResolution || null
    });

    // Update issue
    issue.status = status;
    if (estimatedResolution) issue.estimatedResolution = estimatedResolution;
    if (status === 'resolved') issue.resolvedAt = new Date();

    await issue.save();

    // Post authority comment if note provided
    if (note?.trim()) {
      await Comment.create({
        issue: issueId,
        author: req.user.userId,
        text: `[Status: ${previousStatus} → ${status}] ${note}`,
        isAuthorityUpdate: true
      })

      await Issue.findByIdAndUpdate(issueId, { $inc: { commentCount: 1 } });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(issueId).emit('issue_updated', {
        issueId,
        status,
        previousStatus,
        note
      });
    }

    res.status(200).json({
      success: true,
      issue,
      message: `Status updated to ${status}`
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// PATCH /api/authority/issues/:id/assign — assign to authority user
export const assignIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Check if already assigned
    if (issue.assignedTo) {
      if (issue.assignedTo.toString() === req.user.userId.toString()) {
        return res.status(200).json({ 
          success: true, 
          issue: await issue.populate('assignedTo', 'name'),
          message: 'Issue already assigned to you' 
        });
      }
      return res.status(400).json({ success: false, message: 'Issue assigned already' });
    }

    const previousStatus = issue.status;

    // Assign issue and update status
    issue.assignedTo = req.user.userId;
    issue.status = 'assigned';
    await issue.save();

    // Create status history record
    await StatusUpdate.create({
      issue: issueId,
      updatedBy: req.user.userId,
      previousStatus,
      newStatus: 'assigned',
      note: 'Case assigned to officer'
    });

    await issue.populate('assignedTo', 'name');

    const io = req.app.get('io');
    if (io) {
      io.to(issueId).emit('issue_updated', {
        issueId,
        status: 'assigned'
      });
    }

    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign issue' });
  }
};

// GET /api/authority/stats — summary stats for authority
export const getAuthorityStats = async (req, res) => {
  try {
    const [
      total, reported, verified,
      inProgress, resolved, critical
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'reported' }),
      Issue.countDocuments({ status: 'verified' }),
      Issue.countDocuments({ status: 'in_progress' }),
      Issue.countDocuments({ status: 'resolved' }),
      Issue.countDocuments({ severity: 'critical' })
    ]);

    // Category breakdown
    const categoryBreakdown = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Ward breakdown
    const wardBreakdown = await Issue.aggregate([
      { $group: { _id: '$location.ward', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total, reported, verified,
        inProgress, resolved, critical,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        categoryBreakdown,
        wardBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// GET /api/authority/issues/:id/history
export const getStatusHistory = async (req, res) => {
  try {
    const history = await StatusUpdate.find({ issue: req.params.id })
      .populate('updatedBy', 'name role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};
