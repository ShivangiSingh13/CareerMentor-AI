const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { getResumeById, uploadResume } = require('../controllers/resumeController');

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/:id', authMiddleware, getResumeById);

module.exports = router;
