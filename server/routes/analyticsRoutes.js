const express = require('express');
const { getSkillAnalytics } = require('../controllers/analyticsController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/skills', protect, getSkillAnalytics);

module.exports = router;
