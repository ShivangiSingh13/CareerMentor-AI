const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    jobType: { type: String, enum: ['Full-time', 'Internship', 'Part-time'], required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    experienceRequired: { type: String },
    salaryRange: { type: String },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
