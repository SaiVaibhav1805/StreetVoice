import express from 'express';
import { submitVerification, getVerificationsForIssue } from '../controllers/verifyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:issueId')
  .get(protect, getVerificationsForIssue)
  .post(protect, submitVerification);

export default router;
