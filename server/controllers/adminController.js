const User = require('../models/User');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Application = require('../models/Application');

const seedDemoData = async (req, res) => {
  try {
    // Create a demo recruiter if not exists
    const recruiterEmail = process.env.ADMIN_SEED_EMAIL || 'recruiter@demo.com';
    let recruiter = await User.findOne({ email: recruiterEmail });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Demo Recruiter',
        email: recruiterEmail,
        password: 'password123',
        role: 'recruiter'
      });
    }

    // Create some demo jobs
    const demoJobs = [
      {
        recruiterId: recruiter._id,
        title: 'Frontend Engineer',
        company: 'Acme Apps',
        location: 'Remote',
        jobType: 'Full-time',
        description: 'Build beautiful web apps',
        requiredSkills: ['React', 'JavaScript', 'CSS']
      },
      {
        recruiterId: recruiter._id,
        title: 'Data Scientist Intern',
        company: 'DataWorks',
        location: 'Hybrid',
        jobType: 'Internship',
        description: 'Work on ML pipelines',
        requiredSkills: ['Python', 'Pandas', 'scikit-learn']
      }
    ];

    for (const j of demoJobs) {
      const exists = await Job.findOne({ title: j.title, company: j.company });
      if (!exists) await Job.create(j);
    }

    return res.json({ success: true, message: 'Demo data seeded' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'recruiter'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, message: 'User deleted', data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [userCount, jobCount, resumeCount, applicationCount] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Resume.countDocuments(),
      Application.countDocuments()
    ]);
    return res.json({
      success: true,
      data: { userCount, jobCount, resumeCount, applicationCount }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  seedDemoData,
  listUsers,
  updateUserRole,
  deleteUser,
  getStats
};
