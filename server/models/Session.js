const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED'],
    default: 'SCHEDULED',
  },
  menteeFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  mentorComment: String,
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
