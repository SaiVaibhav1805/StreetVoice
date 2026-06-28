import express from 'express';
import { analyzeImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeImage);  // POST /api/ai/analyze

export default router;