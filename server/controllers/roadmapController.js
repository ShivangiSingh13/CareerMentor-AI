const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require("../services/aiService");
const { createNotification } = require('../services/notificationService');

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

    const roadmapData = await generateRoadmap({ currentSkills: skillsArray, targetRole, timeframeWeeks: 8 });

    const rawWeeks = Array.isArray(roadmapData.weeks) ? roadmapData.weeks : [];
    const normalizedWeeks = rawWeeks.map((w) => {
      const topics = Array.isArray(w.topics)
        ? w.topics.map((t) => (typeof t === 'string' ? t : t?.text || String(t)))
        : [];
      const resources = Array.isArray(w.resources)
        ? w.resources.map((r) => (typeof r === 'string' ? r : r?.text || String(r)))
        : [];
      return {
        title: w.title || 'Week',
        topics,
        resources,
        completed: false
      };
    });

    const roadmap = await Roadmap.create({
      userId: req.user.userId,
      targetRole,
      currentSkills: skillsArray,
      timeframeWeeks: 8,
      weeks: normalizedWeeks
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

const markWeekComplete = async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const weekIndex = Number(req.params.index);
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user.userId });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    if (!Number.isInteger(weekIndex) || weekIndex < 0 || weekIndex >= (roadmap.weeks || []).length) {
      return res.status(400).json({ success: false, message: 'Invalid week index' });
    }

    roadmap.weeks[weekIndex].completed = true;
    await roadmap.save();

    // Notify user about week completion
    try {
      await createNotification({
        userId: req.user.userId,
        type: 'roadmap',
        title: `Roadmap week ${weekIndex + 1} completed`,
        message: `You completed week ${weekIndex + 1} of your roadmap: ${roadmap.targetRole}`,
        linkTo: `/roadmap/${roadmap._id}`
      });
    } catch (notifyErr) {
      console.error('Failed to notify about roadmap week completion:', notifyErr.message);
    }

    // If all weeks completed, notify final completion
    const allDone = (roadmap.weeks || []).every((w) => w.completed === true);
    if (allDone) {
      try {
        await createNotification({
          userId: req.user.userId,
          type: 'roadmap',
          title: 'Roadmap fully completed',
          message: `Congratulations — you completed the roadmap for ${roadmap.targetRole}`,
          linkTo: `/roadmap/${roadmap._id}`
        });
      } catch (notifyErr) {
        console.error('Failed to notify about roadmap completion:', notifyErr.message);
      }
    }

    return res.json({ success: true, message: 'Week marked complete', data: roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to mark week complete' });
  }
};

module.exports = {
  createRoadmap,
  getRoadmapById,
  markWeekComplete
};

