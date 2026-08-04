const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    cb(isPdf ? null : new Error('Only PDF files are allowed'), isPdf);
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
