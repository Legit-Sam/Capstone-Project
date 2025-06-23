const mongoose = require("mongoose")


const mentorshipRequestSchema = new mongoose.Schema({
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
    }, 
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);