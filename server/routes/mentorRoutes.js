const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { chat, getHistory } = require('../controllers/mentorController');

const router = express.Router();

router.get('/history', authMiddleware, getHistory);
router.post('/chat', authMiddleware, chat);

module.exports = router;
