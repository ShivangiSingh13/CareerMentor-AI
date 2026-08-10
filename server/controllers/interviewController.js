const Interview = require('../models/Interview');
const { generateInterviewQuestions, evaluateAnswer } = require('../services/aiService');

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const startInterview = async (req, res) => {
  try {
    const { role, experience, type, skills } = req.body;

    if (!role || !type) {
      return res.status(400).json({ success: false, message: 'Role and interview type are required' });
    }

    const normalizedSkills = normalizeSkills(skills);
    const questionData = await generateInterviewQuestions({ role, experience, type, skills: normalizedSkills });
    const questions = (questionData.questions || []).slice(0, 5).map((question) => ({
      question,
      userAnswer: '',
      aiFeedback: '',
      suggestedAnswer: '',
      improvementTips: [],
      score: null,
    }));

    const interview = await Interview.create({
      userId: req.user.userId,
      role,
      experience: experience || 'Fresher',
      skills: normalizedSkills,
      type,
      questions,
      status: 'in-progress',
    });

    return res.status(201).json({ success: true, message: 'Interview started successfully', interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to start interview' });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const question = interview.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const feedback = await evaluateAnswer({
      question: question.question,
      answer,
      role: interview.role,
      type: interview.type,
    });

    question.userAnswer = answer || '';
    question.aiFeedback = feedback.feedback || '';
    question.suggestedAnswer = feedback.suggestedAnswer || '';
    question.improvementTips = Array.isArray(feedback.improvementTips) ? feedback.improvementTips : [];
    question.score = Number(feedback.score) || 0;

    const allAnswered = interview.questions.every((entry) => entry.score !== null);
    if (allAnswered) {
      const averageScore = interview.questions.reduce((sum, entry) => sum + (Number(entry.score) || 0), 0) / interview.questions.length;
      const answerLengthScore = interview.questions.reduce((sum, entry) => sum + (entry.userAnswer?.trim().length || 0), 0);
      interview.overallScore = Number(averageScore.toFixed(1));
      interview.confidenceScore = Number(Math.min(10, Math.max(0, (averageScore * 0.7) + Math.min(3, answerLengthScore / 300)).toFixed(1)));
      interview.status = 'completed';
    }

    await interview.save();
    return res.json({ success: true, message: 'Answer submitted successfully', interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to submit answer' });
  }
};

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    return res.json({ success: true, interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch interview' });
  }
};

const listInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('role type experience overallScore status createdAt');

    return res.json({ success: true, interviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch interviews' });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterview,
  listInterviews,
};
