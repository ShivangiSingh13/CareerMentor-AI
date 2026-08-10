const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createRoadmap, getRoadmapById, markWeekComplete } = require('../controllers/roadmapController');

const router = express.Router();

router.post('/generate', authMiddleware, createRoadmap);
router.get('/:id', authMiddleware, getRoadmapById);
router.patch('/:id/weeks/:index/complete', authMiddleware, markWeekComplete);

module.exports = router;
