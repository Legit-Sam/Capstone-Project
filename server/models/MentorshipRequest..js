const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'SCHEDULED', 'COMPLETED'],
    default: 'PENDING'
  },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
