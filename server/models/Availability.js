const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  availability: [
    {
      dayOfWeek: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
      },
      startTime: { type: String, required: true }, // e.g. "09:00"
      endTime: { type: String, required: true },   // e.g. "15:00"
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Availability', availabilitySchema);
