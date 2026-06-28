import express from 'express';
import { addComment, getComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, addComment);
router.get('/', protect, getComments);
router.delete('/:commentId', protect, deleteComment);

export default router;