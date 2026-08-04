const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalFilename: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      default: ''
    },
    atsScore: {
      type: Number,
      default: 0
    },
    missingSkills: {
      type: [String],
      default: []
    },
    suggestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
