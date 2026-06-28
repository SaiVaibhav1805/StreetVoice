import express from 'express';
import { getPublicDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getPublicDashboard);

export default router;