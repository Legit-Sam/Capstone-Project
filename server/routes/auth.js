// server/routes/auth.js
const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

module.exports = router;