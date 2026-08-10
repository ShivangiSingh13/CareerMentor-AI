const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied' },
    coverNote: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
