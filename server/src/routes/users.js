const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const { protect } = require('../middleware/authMiddleware');
const { BADGES } = require('../services/gamificationService');

// GET /api/users/leaderboard
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const users = await User.find({ role: 'citizen' })
            .sort({ xp: -1 })
            .limit(20)
            .select('name ward xp badges issuesReported issuesVerified');

        res.status(200).json({ success: true, users });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
});

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-__v');
        const myIssues = await Issue.find({ reportedBy: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status category createdAt');

        const badgeDetails = BADGES.filter(b => user.badges.includes(b.id))
            .map(b => ({ id: b.id, label: b.label, emoji: b.emoji }));

        res.status(200).json({ success: true, user, myIssues, badgeDetails });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

module.exports = router;