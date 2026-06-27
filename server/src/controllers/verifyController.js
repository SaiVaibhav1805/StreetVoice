const Verification = require('../models/Verification');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { uploadImage } = require('../services/imageService');

// POST /api/issues/:id/verify
const verifyIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.userId;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Can't verify your own issue
    if (issue.reportedBy.toString() === userId) {
      return res.status(400).json({ success: false, message: "You can't verify your own issue" });
    }

    // Already verified?
    const existing = await Verification.findOne({ issue: issueId, verifiedBy: userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already verified this issue' });
    }

    // Upload verification photo if provided
    let photo = {};
    if (req.file) {
      photo = await uploadImage(req.file.buffer, req.file.mimetype);
    }

    const verification = await Verification.create({
      issue: issueId,
      verifiedBy: userId,
      photo,
      comment: req.body.comment || '',
      location: {
        coordinates: [
          parseFloat(req.body.longitude || 0),
          parseFloat(req.body.latitude || 0)
        ]
      }
    });

    // Increment verification count on issue
    issue.verificationCount += 1;

    // Auto-escalate to verified status at 3+ verifications
    if (issue.verificationCount >= 3 && issue.status === 'reported') {
      issue.status = 'verified';

      // Emit socket event
      const io = req.app.get('io');
      io.to(issueId).emit('issue_updated', { status: 'verified', issueId });
    }

    await issue.save();

    // Award XP to verifier
    await User.findByIdAndUpdate(userId, {
      $inc: { xp: 5, issuesVerified: 1 }
    });

    res.status(201).json({
      success: true,
      verificationCount: issue.verificationCount,
      status: issue.status,
      message: `Issue verified! +5 XP earned${issue.status === 'verified' ? ' — Issue is now Verified status! 🎉' : ''}`
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already verified' });
    }
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// GET /api/issues/:id/verifications
const getVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ issue: req.params.id })
      .populate('verifiedBy', 'name ward')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch verifications' });
  }
};

module.exports = { verifyIssue, getVerifications };