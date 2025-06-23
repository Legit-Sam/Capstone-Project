const express = require('express');
const {
  upsertAvailability,
  getMyAvailability,
  deleteAvailability,
  getMentorAvailability
} = require('../controllers/availabilityController');
const { requireAuth, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.post('/', requireAuth, restrictTo('MENTOR'), upsertAvailability);
router.get('/', requireAuth, restrictTo('MENTOR'), getMyAvailability);
router.delete('/:id', requireAuth, restrictTo('MENTOR'), deleteAvailability);
router.get('/:mentorId', requireAuth, getMentorAvailability);

module.exports = router;
