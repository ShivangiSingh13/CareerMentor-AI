const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const jobController = require('../controllers/jobController');

router.post('/', authMiddleware, roleMiddleware(['recruiter']), jobController.createJob);
router.patch('/:id', authMiddleware, roleMiddleware(['recruiter']), jobController.updateJob);
router.delete('/:id', authMiddleware, roleMiddleware(['recruiter']), jobController.deleteJob);
router.get('/', authMiddleware, jobController.listJobs);
router.get('/recruiter/mine', authMiddleware, roleMiddleware(['recruiter']), jobController.listMyPostedJobs);
router.get('/:id', authMiddleware, jobController.getJob);

module.exports = router;
