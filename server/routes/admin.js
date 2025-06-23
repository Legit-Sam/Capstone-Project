// server/routes/admin.js
const express = require('express');
const { listUsers, updateUserRole, getMentorAvailability, getAllMatches, getSessionStats, assignMentor } = require('../controllers/adminController');
const { requireAuth, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/users', requireAuth, restrictTo('ADMIN'), listUsers);
router.put('/users/:id/role', requireAuth, restrictTo('ADMIN'), updateUserRole);
router.get('/mentor/:mentorId/availability', requireAuth, restrictTo('ADMIN'), getMentorAvailability);
router.get('/matches', requireAuth, restrictTo("ADMIN"), getAllMatches);
router.get('/sessions/stats', requireAuth, restrictTo("ADMIN"), getSessionStats);
router.post('/assign-mentor', requireAuth, restrictTo("ADMIN"), assignMentor);

module.exports = router;