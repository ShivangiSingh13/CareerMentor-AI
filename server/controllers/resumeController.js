const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { analyzeResume } = require('../services/aiService');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'A PDF resume file is required' });
    }

    const parsedPdf = await pdfParse(req.file.buffer);
    const extractedText = parsedPdf.text || '';
    const analysis = await analyzeResume(extractedText);

    const resume = await Resume.create({
      userId: req.user.userId,
      originalFilename: req.file.originalname,
      extractedText,
      atsScore: Number(analysis.atsScore) || 0,
      missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : []
    });

    return res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      resume
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Resume analysis failed' });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
};

module.exports = {
  uploadResume,
  getResumeById
};
