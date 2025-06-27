const express = require('express');
const { requireAuth, restrictTo } = require('../middleware/auth');
const {
  scheduleSession,
  getMySessions,
  submitFeedback,
  getCompletedSessions
} = require('../controllers/sessionController');


const router = express.Router();

router.post('/', requireAuth, restrictTo('MENTEE'), scheduleSession);
router.get('/', requireAuth, getMySessions);
router.get("/completed", requireAuth, restrictTo("MENTOR"), getCompletedSessions);

router.put('/:id/feedback', requireAuth, submitFeedback);

module.exports = router;
