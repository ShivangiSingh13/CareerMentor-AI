const Resume = require('../models/Resume');

const getSkillAnalytics = async (req, res) => {
  try {
    const overall = await Resume.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$atsScore' }, count: { $sum: 1 } } }
    ]);

    const avgScore = overall[0]?.avgScore ?? 0;
    const totalResumes = overall[0]?.count ?? 0;

    const buckets = await Resume.aggregate([
      { $bucket: { groupBy: '$atsScore', boundaries: [0, 20, 40, 60, 80, 101], default: '100+', output: { count: { $sum: 1 } } } }
    ]);

    const missing = await Resume.aggregate([
      { $unwind: { path: '$missingSkills', preserveNullAndEmptyArrays: true } },
      { $match: { missingSkills: { $ne: null } } },
      { $group: { _id: '$missingSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recent = await Resume.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, avgScore: { $avg: '$atsScore' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return res.json({ success: true, data: { avgScore, totalResumes, buckets, missing, recent } });
  } catch (error) {
    console.error('analytics error', error.message);
    return res.status(500).json({ success: false, message: 'Failed to compute analytics' });
  }
};

module.exports = { getSkillAnalytics };
