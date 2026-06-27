const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addComment);
router.get('/', protect, getComments);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;