const multer = require('multer');

const storage = multer.memoryStorage(); // keep in memory, upload to cloudinary

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images and videos are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;