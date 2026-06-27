const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id
const { verifyIssue, getVerifications } = require('../controllers/verifyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('photo'), verifyIssue);
router.get('/', protect, getVerifications);

module.exports = router;