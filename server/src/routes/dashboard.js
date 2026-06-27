const express = require('express');
const router = express.Router();
const { getPublicDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPublicDashboard);

module.exports = router;