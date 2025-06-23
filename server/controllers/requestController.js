// server/controllers/requestController.js
const { body, validationResult } = require('express-validator');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');

const createRequest = [
  body('mentorId').isMongoId().withMessage('Invalid mentor ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mentorId } = req.body;

    try {
      // Verify mentor exists and is a mentor
      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== 'MENTOR') {
        return res.status(400).json({ error: 'Invalid mentor' });
      }

      // Check for existing request
      const existingRequest = await MentorshipRequest.findOne({
        menteeId: req.user.id,
        mentorId,
        status: 'PENDING',
      });
      if (existingRequest) {
        return res.status(400).json({ error: 'Request already pending' });
      }

      const request = await MentorshipRequest.create({
        menteeId: req.user.id,
        mentorId,
        status: 'PENDING',
      });

      res.status(201).json(request);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
];

const getSentRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ menteeId: req.user.id })
      .populate('mentorId', 'email profile.name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentorId: req.user.id })
      .populate('menteeId', 'email profile.name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRequestStatus = [
  body('status')
    .isIn(['ACCEPTED', 'REJECTED'])
    .withMessage('Invalid status'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    try {
      const request = await MentorshipRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.mentorId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (request.status !== 'PENDING') {
        return res.status(400).json({ error: 'Request already processed' });
      }

      request.status = status;
      await request.save();

      res.json(request);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
];

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
};