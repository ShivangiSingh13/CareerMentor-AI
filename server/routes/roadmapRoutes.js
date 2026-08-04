const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createRoadmap, getRoadmapById } = require('../controllers/roadmapController');

const router = express.Router();

router.post('/generate', authMiddleware, createRoadmap);
router.get('/:id', authMiddleware, getRoadmapById);

module.exports = router;
