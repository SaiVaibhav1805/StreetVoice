const express = require('express');
const router = express.Router();
const {
  createIssue, getIssues, getIssueById, upvoteIssue
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getIssues);
router.post('/', protect, upload.single('image'), createIssue);
router.get('/:id', protect, getIssueById);
router.post('/:id/upvote', protect, upvoteIssue);

module.exports = router;