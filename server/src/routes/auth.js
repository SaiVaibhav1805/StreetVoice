const express = require('express');
const router = express.Router();
const {
    getAllIssues,
    updateIssueStatus,
    assignIssue,
    getAuthorityStats,
    getStatusHistory
} = require('../controllers/authorityController');
const { protect, authorityOnly } = require('../middleware/authMiddleware');

// All routes require auth + authority role
router.use(protect, authorityOnly);

router.get('/issues', getAllIssues);
router.get('/stats', getAuthorityStats);
router.patch('/issues/:id/status', updateIssueStatus);
router.patch('/issues/:id/assign', assignIssue);
router.get('/issues/:id/history', getStatusHistory);

module.exports = router;