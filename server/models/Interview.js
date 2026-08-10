const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  aiFeedback: { type: String, default: '' },
  suggestedAnswer: { type: String, default: '' },
  improvementTips: { type: [String], default: [] },
  score: { type: Number, default: null, min: 0, max: 10 },
}, { _id: true });

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, required: true },
  experience: { type: String, default: 'Fresher' },
  skills: { type: [String], default: [] },
  type: { type: String, enum: ['HR', 'Technical', 'Behavioral'], required: true },
  questions: { type: [questionSchema], default: [] },
  overallScore: { type: Number, default: null, min: 0, max: 10 },
  confidenceScore: { type: Number, default: null, min: 0, max: 10 },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
