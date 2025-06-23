// server/routes/requests.js
const express = require('express');
const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { requireAuth, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.post('/', requireAuth, restrictTo('MENTEE'), createRequest);
router.get('/sent', requireAuth, restrictTo('MENTEE'), getSentRequests);
router.get('/received', requireAuth, restrictTo('MENTOR'), getReceivedRequests);
router.put('/:id', requireAuth, restrictTo('MENTOR'), updateRequestStatus);

module.exports = router;