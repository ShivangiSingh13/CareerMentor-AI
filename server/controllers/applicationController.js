const Application = require('../models/Application');
const Job = require('../models/Job');
const { createNotification } = require('../services/notificationService');

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId is required' });

    const existing = await Application.findOne({ jobId, studentId: req.user.userId });
    if (existing) return res.status(409).json({ success: false, message: 'Already applied to this job' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const application = await Application.create({ jobId, studentId: req.user.userId, coverNote });
    return res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to apply to job' });
  }
};

const listMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.userId }).populate({ path: 'jobId', select: 'title company' }).sort({ createdAt: -1 });
    return res.json({ success: true, message: 'Applications retrieved', data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to list applications' });
  }
};

const listApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiterId.toString() !== req.user.userId) return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });

    const applicants = await Application.find({ jobId }).populate({ path: 'studentId', select: 'name email' }).sort({ createdAt: -1 });
    return res.json({ success: true, message: 'Applicants retrieved', data: applicants });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to list applicants' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const job = await Job.findById(application.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Related job not found' });
    if (job.recruiterId.toString() !== req.user.userId) return res.status(403).json({ success: false, message: 'Not authorized to update application for this job' });

    application.status = status;
    await application.save();
    try {
      await createNotification({
        userId: application.studentId,
        type: 'application',
        title: 'Application status updated',
        message: `Your application for ${job.title} is now ${application.status}`,
        linkTo: `/applications`
      });
    } catch (notifyErr) {
      console.error('Failed to notify student about status change:', notifyErr.message);
    }
    return res.json({ success: true, message: 'Application status updated', data: application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update status' });
  }
};

module.exports = {
  applyToJob,
  listMyApplications,
  listApplicantsForJob,
  updateApplicationStatus
};
