// server/routes/users.js
const express = require('express');
const {
  getCurrentUser,
  getUserById,
  updateProfile,
} = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/me', requireAuth, getCurrentUser);
router.get('/:id', requireAuth, getUserById);
router.put('/me/profile', requireAuth, updateProfile);


// ✅ NEW: Get all users or filter by role (e.g., ?role=MENTOR)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;