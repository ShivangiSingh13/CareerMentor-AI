const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  startInterview,
  submitAnswer,
  getInterview,
  listInterviews,
} = require('../controllers/interviewController');

const router = express.Router();

router.use(authMiddleware);

router.post('/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.get('/:id', getInterview);
router.get('/', listInterviews);

module.exports = router;
