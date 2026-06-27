const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeImage);  // POST /api/ai/analyze

module.exports = router;