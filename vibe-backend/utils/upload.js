const multer = require('multer');
const path = require('path');

/**
 * Custom Cloudinary upload using the Cloudinary v2 SDK.
 * multer handles the file storage; cloudinary.uploadStream uploads it.
 */
function getUploader(folder = 'vibe-connect') {
  const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, unique);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

  return upload;
}

module.exports = { getUploader };
