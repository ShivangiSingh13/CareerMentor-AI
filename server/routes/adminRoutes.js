const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protected admin/recruiter routes
router.post('/seed', authMiddleware, roleMiddleware(['recruiter']), adminController.seedDemoData);
router.get('/users', authMiddleware, roleMiddleware(['recruiter']), adminController.listUsers);
router.patch('/users/:id/role', authMiddleware, roleMiddleware(['recruiter']), adminController.updateUserRole);
router.delete('/users/:id', authMiddleware, roleMiddleware(['recruiter']), adminController.deleteUser);
router.get('/stats', authMiddleware, roleMiddleware(['recruiter']), adminController.getStats);

module.exports = router;
