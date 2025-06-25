const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register user
const register = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MENTOR', 'MENTEE'])
    .withMessage('Invalid role'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const adminExists = await User.exists({ role: 'ADMIN' });

      if (!adminExists && email === process.env.ADMIN_EMAIL) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          email,
          password: hashedPassword,
          role: 'ADMIN',
        });

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

       res.cookie('jwt', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // 🛡️ HTTPS only in production
  sameSite: 'None', // 🧭 Required for cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // optional: 1 week
});

        return res.status(201).json({
          id: user._id,
          email: user.email,
          role: user.role,
          message: 'Admin registered and logged in',
        });
      }

      if (role && role !== 'MENTEE') {
        if (!req.user || req.user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only admins can assign roles' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        role: role || 'MENTEE',
      });

      return res.status(201).json({
        id: user._id,
        email: user.email,
        role: user.role,
        message: 'Registration successful. Please log in.',
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

// Login user
const login = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

     res.cookie('jwt', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // 🛡️ HTTPS only in production
  sameSite: 'None', // 🧭 Required for cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // optional: 1 week
});

      res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        message: 'Login successful',
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

// Logout user
const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.json({ message: 'Logged out successfully' });
};

// Get current user
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, logout, getMe };
