import express from 'express';
import {
  createIssue, getIssues, getIssueById, upvoteIssue
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getIssues);
router.post('/', protect, upload.single('image'), createIssue);
router.get('/:id', protect, getIssueById);
router.post('/:id/upvote', protect, upvoteIssue);

export default router;