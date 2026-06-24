import express from 'express';
import { getIssues, getIssueById, createIssue, upvoteIssue, uploadTempImage } from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getIssues)
  .post(protect, createIssue);

router.route('/upload-temp')
  .post(protect, uploadSingle, uploadTempImage);

router.route('/:id')
  .get(protect, getIssueById);

router.route('/:id/upvote')
  .post(protect, upvoteIssue);

export default router;
