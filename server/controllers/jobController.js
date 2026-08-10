const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

const createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, description, requiredSkills, experienceRequired, salaryRange } = req.body;
    if (!title || !company || !jobType) {
      return res.status(400).json({ success: false, message: 'Title, company and jobType are required' });
    }

    const job = await Job.create({
      recruiterId: req.user.userId,
      title,
      company,
      location,
      jobType,
      description,
      requiredSkills: requiredSkills || [],
      experienceRequired,
      salaryRange
    });

    // Notify all students about new job (simple approach)
    try {
      const students = await User.find({ role: 'student' }).select('_id');
      await Promise.all(
        students.map((s) =>
          createNotification({
            userId: s._id,
            type: 'job',
            title: 'New job posted',
            message: `New job: ${job.title} at ${job.company}`,
            linkTo: `/jobs/${job._id}`
          })
        )
      );
    } catch (notifyErr) {
      console.error('Failed to create job notifications:', notifyErr.message);
    }

    return res.status(201).json({ success: true, message: 'Job created', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    Object.assign(job, req.body);
    await job.save();
    return res.json({ success: true, message: 'Job updated', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    return res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete job' });
  }
};

const listJobs = async (req, res) => {
  try {
    const { search, jobType, location } = req.query;
    const filter = { status: 'open' };
    if (jobType) filter.jobType = jobType;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, message: 'Jobs retrieved', data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to list jobs' });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    return res.json({ success: true, message: 'Job retrieved', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to get job' });
  }
};

const listMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, message: 'My jobs retrieved', data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to list my jobs' });
  }
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  listJobs,
  getJob,
  listMyPostedJobs
};
