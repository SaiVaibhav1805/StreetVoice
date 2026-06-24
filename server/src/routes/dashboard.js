import express from 'express';
import { getStats, getWardReports } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/wards', protect, getWardReports);

export default router;
