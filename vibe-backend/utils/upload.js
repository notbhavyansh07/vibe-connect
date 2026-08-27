const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

function getUploader(folder = 'vibe-connect') {
  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp/;
      const extname = allowed.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowed.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      }
      cb(new Error('Only image files are allowed'));
    },
  });
}

const upload = getUploader();

module.exports = upload;
module.exports.getUploader = getUploader;
