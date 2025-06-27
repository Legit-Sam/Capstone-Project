const express = require('express');
const { requireAuth, restrictTo } = require('../middleware/auth');
const {
  scheduleSession,
  getMySessions,
  submitFeedback
} = require('../controllers/sessionController');

const router = express.Router();

router.post('/', requireAuth, restrictTo('MENTEE'), scheduleSession);
router.get('/', requireAuth, getMySessions);
router.get("/completed", requireAuth, restrictTo("MENTOR"), async (req, res) => {
  try {
    const sessions = await Session.find({
      mentor: req.user.id,
      status: "COMPLETED"
    }).populate("mentee", "profile");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.put('/:id/feedback', requireAuth, submitFeedback);

module.exports = router;
