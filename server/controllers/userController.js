const { body, validationResult } = require('express-validator');
const User = require('../models/User');


const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = [
  body('name').notEmpty().withMessage('Name is required'),
  body('bio').notEmpty().withMessage('Bio is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('goals').notEmpty().withMessage('Goals are required'),
  body('industry').optional().isString().withMessage('Industry must be a string'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio, skills, goals, industry } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          profile: { name, bio, skills, goals, industry },
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user.profile);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
];

module.exports = { getCurrentUser, getUserById, updateProfile };