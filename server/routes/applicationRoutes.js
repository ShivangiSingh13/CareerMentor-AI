const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const applicationController = require('../controllers/applicationController');

router.post('/', authMiddleware, roleMiddleware(['student']), applicationController.applyToJob);
router.get('/mine', authMiddleware, roleMiddleware(['student']), applicationController.listMyApplications);
router.get('/job/:jobId', authMiddleware, roleMiddleware(['recruiter']), applicationController.listApplicantsForJob);
router.patch('/:id/status', authMiddleware, roleMiddleware(['recruiter']), applicationController.updateApplicationStatus);

module.exports = router;
