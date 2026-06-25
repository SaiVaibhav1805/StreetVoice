import express from 'express';
const router = express.Router();
import { verifyAndLogin, updateProfile, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/verify', verifyAndLogin);           // POST /api/auth/verify
router.put('/profile', protect, updateProfile);   // PUT  /api/auth/profile
router.get('/me', protect, getMe);                // GET  /api/auth/me

export default router;