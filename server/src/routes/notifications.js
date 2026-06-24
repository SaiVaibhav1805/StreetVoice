import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mock endpoints matching the client notificationService expectations
router.get('/', protect, (req, res) => {
  res.json([
    { _id: '1', title: 'Pothole Verified', body: 'Your reported pothole in Koramangala has been verified by the community.', read: false, createdAt: new Date() },
    { _id: '2', title: 'Achievement Unlocked!', body: 'You unlocked the First Responder badge. Keep it up!', read: true, createdAt: new Date() },
  ]);
});

router.put('/:id/read', protect, (req, res) => {
  res.json({ message: 'Notification marked as read' });
});

router.put('/read-all', protect, (req, res) => {
  res.json({ message: 'All notifications marked as read' });
});

router.post('/subscribe', protect, (req, res) => {
  res.json({ message: 'Push notification subscription successful' });
});

export default router;
