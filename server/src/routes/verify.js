import express from 'express';
import { verifyIssue, getVerifications } from '../controllers/verifyController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access :id

router.post('/', protect, upload.single('photo'), verifyIssue);
router.get('/', protect, getVerifications);

export default router;