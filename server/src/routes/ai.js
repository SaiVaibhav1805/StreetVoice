import express from 'express';
import { analyzeImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze-image', protect, analyzeImage);

export default router;
