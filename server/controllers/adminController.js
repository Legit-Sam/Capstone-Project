const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Availability = require('../models/Availability');
const MentorshipRequest = require('../models/MentorshipRequest');
const Session = require('../models/Session');

// GET /admin/users
const listUsers = async (req, res) => {
  try {
  const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');

const response = users.map((u) => ({
  ...u.toObject(),
  isSystemAdmin: u.email === process.env.ADMIN_EMAIL
}));

res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /admin/users/:id/role
const updateUserRole = [
  body('role')
    .isIn(['ADMIN', 'MENTOR', 'MENTEE'])
    .withMessage('Invalid role'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;

    try {
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }

      const targetEmail = targetUser.email?.toLowerCase();
      const requesterEmail = req.user.email?.toLowerCase();
      const systemAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

      // Prevent changing the system admin role — even by the system admin
      if (targetEmail === systemAdminEmail && role !== 'ADMIN') {
        return res.status(403).json({ error: 'System admin role cannot be changed' });
      }

      // Prevent self-demotion
      if (req.user.id === req.params.id && role !== 'ADMIN') {
        return res.status(400).json({ error: "You can't remove your own admin access" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(updatedUser);
    } catch (err) {
      console.error('Role update error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];



// GET /admin/mentor/:mentorId/availability
const getMentorAvailability = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'MENTOR') {
      return res.status(400).json({ error: 'Invalid mentor ID' });
    }

    const availability = await Availability.find({ mentorId });

    res.json({ mentor: mentor.email, availability });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// GET /admin/matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await MentorshipRequest.find()
      .populate('mentorId', 'email')
      .populate('menteeId', 'email');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// GET /admin/session-stats
const getSessionStats = async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.find({ status: 'COMPLETED' })
      .populate('mentorId', 'email')
      .populate('menteeId', 'email')
      .sort({ date: -1 });

    const feedback = completedSessions.map((s) => ({
      sessionId: s._id,
      date: s.date,
      mentor: s.mentorId?.email,
      mentee: s.menteeId?.email,
      mentorComment: s.mentorComment || null,
      menteeRating: s.menteeFeedback?.rating || null,
      menteeComment: s.menteeFeedback?.comment || null,
    }));

    res.json({ totalSessions, completed: completedSessions.length, feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get session stats' });
  }
};

// POST /admin/assign-mentor
const assignMentor = async (req, res) => {
  const { mentorId, menteeId } = req.body;

  if (!mentorId || !menteeId) {
    return res.status(400).json({ error: 'Mentor and mentee IDs are required' });
  }

  try {
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    if (!mentor || mentor.role !== 'MENTOR') {
      return res.status(400).json({ error: 'Invalid mentor' });
    }

    if (!mentee || mentee.role !== 'MENTEE') {
      return res.status(400).json({ error: 'Invalid mentee' });
    }

    const existing = await MentorshipRequest.findOne({
      mentorId,
      menteeId,
      status: 'ACCEPTED'
    });

    if (existing) {
      return res.status(400).json({ error: 'Already matched' });
    }

    const match = await MentorshipRequest.create({
      mentorId,
      menteeId,
      status: 'ACCEPTED'
    });

    res.status(201).json({ message: 'Mentor assigned manually', match });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign mentor' });
  }
};

module.exports = {
  listUsers,
  updateUserRole,
  getMentorAvailability,
  getAllMatches,
  getSessionStats,
  assignMentor
};
