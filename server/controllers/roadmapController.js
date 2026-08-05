const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require("../services/aiService");

const createRoadmap = async (req, res) => {
  try {
    const { currentSkills, targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'Target role is required' });
    }

    const skillsArray = Array.isArray(currentSkills)
      ? currentSkills
      : String(currentSkills || '')
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean);

    const roadmapData = await generateRoadmap({ currentSkills: skillsArray, targetRole });

    const roadmap = await Roadmap.create({
      userId: req.user.userId,
      targetRole,
      currentSkills: skillsArray,
      weeks: Array.isArray(roadmapData.weeks) ? roadmapData.weeks : []
    });

    return res.status(201).json({
      success: true,
      message: 'Roadmap generated successfully',
      roadmap
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to generate roadmap' });
  }
};

const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    return res.json({ success: true, roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch roadmap' });
  }
};

module.exports = {
  createRoadmap,
  getRoadmapById
};
