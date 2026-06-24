const express = require('express');
const router = express.Router();
const { verifyAndLogin, updateProfile, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', verifyAndLogin);           // POST /api/auth/verify
router.put('/profile', protect, updateProfile);   // PUT  /api/auth/profile
router.get('/me', protect, getMe);                // GET  /api/auth/me

module.exports = router;