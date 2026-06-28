import express from 'express';
import { sendOTP, verifyAndLogin, updateProfile, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOTP);                 // POST /api/auth/send-otp
router.post('/verify', verifyAndLogin);             // POST /api/auth/verify
router.put('/profile', protect, updateProfile);     // PUT  /api/auth/profile
router.get('/me', protect, getMe);                  // GET  /api/auth/me

export default router;