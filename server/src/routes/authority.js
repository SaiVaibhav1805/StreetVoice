import express from 'express';
import {
  getAllIssues,
  updateIssueStatus,
  assignIssue,
  getAuthorityStats,
  getStatusHistory
} from '../controllers/authorityController.js';
import { protect, authorityOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require auth + authority role
router.use(protect, authorityOnly);

router.get('/issues', getAllIssues);
router.get('/stats', getAuthorityStats);
router.patch('/issues/:id/status', updateIssueStatus);
router.patch('/issues/:id/assign', assignIssue);
router.get('/issues/:id/history', getStatusHistory);

export default router;
