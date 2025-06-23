const Session = require('../models/Session');
const MentorshipRequest = require('../models/MentorshipRequest');
const Availability = require('../models/Availability');
const User = require('../models/User');


const getNextDateForDay = (dayOfWeek) => {
  const daysMap = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  };
  const targetDay = daysMap[dayOfWeek];
  if (targetDay === undefined) return null;

  const today = new Date();
  const todayDay = today.getDay();

  let daysUntilNext = (targetDay - todayDay + 7) % 7;
  if (daysUntilNext === 0) daysUntilNext = 7; // skip today

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  return nextDate;
};

// Mentee schedules a session with mentor
const scheduleSession = async (req, res) => {
  const { mentorId, sessions } = req.body;

  if (!mentorId || !Array.isArray(sessions) || sessions.length === 0) {
    return res.status(400).json({ error: 'Mentor and sessions are required' });
  }

  try {
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'MENTOR') {
      return res.status(400).json({ error: 'Invalid mentor selected' });
    }

    const request = await MentorshipRequest.findOne({
      menteeId: req.user.id,
      mentorId,
      status: 'ACCEPTED'
    });

    if (!request) {
      return res.status(403).json({ error: 'No accepted mentorship request' });
    }

    const availabilityDoc = await Availability.findOne({ mentorId });
    if (!availabilityDoc || !Array.isArray(availabilityDoc.availability)) {
      return res.status(400).json({ error: 'Mentor has no availability set' });
    }

    const newSessions = [];

  for (const slot of sessions) {
  const { dayOfWeek, startTime, endTime } = slot;

  const match = availabilityDoc.availability.find((a) =>
    a.dayOfWeek === dayOfWeek &&
    a.startTime <= startTime &&
    a.endTime >= endTime
  );

  if (!match) {
    return res.status(400).json({
      error: `Mentor not available on ${dayOfWeek} between ${startTime} - ${endTime}`
    });
  }

  const sessionDate = getNextDateForDay(dayOfWeek);
  if (!sessionDate) {
    return res.status(400).json({ error: `Invalid day: ${dayOfWeek}` });
  }

  const [hour, minute] = startTime.split(":");
  sessionDate.setHours(Number(hour), Number(minute), 0, 0); // precise start time

const existing = await Session.findOne({
  mentorId,
  menteeId: req.user.id,
  date: sessionDate
});

if (existing) {
  return res.status(400).json({
    error: `You already have a session booked with this mentor on ${sessionDate.toLocaleString()}`
  });
}

newSessions.push({
  mentorId,
  menteeId: req.user.id,
  date: sessionDate,
  status: 'SCHEDULED'
});
}


    const saved = await Session.insertMany(newSessions);
    await MentorshipRequest.findOneAndUpdate(
      {
        mentorId,
        menteeId: req.user.id,
        status: 'ACCEPTED'
      },
      {
        status: 'SCHEDULED'
      }
    );

    return res.status(201).json({ message: 'Sessions scheduled', sessions: saved });
  } catch (err) {
    console.error('Schedule session error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};



// Get sessions (for mentor or mentee)
const getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Find all sessions where user is either mentor or mentee
    const sessions = await Session.find({
      $or: [{ mentorId: userId }, { menteeId: userId }],
    }).sort({ date: 1 });



    // Step 2: Map through sessions and manually fetch mentor + mentee info
    const enriched = await Promise.all(
      sessions.map(async (session) => {
        const mentor = await User.findById(session.mentorId).select(
          'email profile.name profile.industry'
        );
        const mentee = await User.findById(session.menteeId).select(
          'email profile.name profile.skills'
        );

        return {
          ...session.toObject(),
          mentor,
          mentee,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Error in getMySessions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit feedback (mentee + optional mentor comment)
const submitFeedback = async (req, res) => {
  const { rating, comment, mentorComment } = req.body;

  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const isMentor = req.user.id === session.mentorId.toString();
    const isMentee = req.user.id === session.menteeId.toString();

    if (!isMentor && !isMentee) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // 1. MENTOR completes the session
    if (isMentor) {
      if (session.status === 'COMPLETED') {
        return res.status(400).json({ error: 'Session already completed' });
      }

      session.mentorComment = mentorComment || null;
      session.status = 'COMPLETED';

      await session.save();
      return res.json({ message: 'Session marked as completed by mentor', session });
    }

    // 2. MENTEE gives feedback only after mentor completes
    if (isMentee) {
      if (session.status !== 'COMPLETED') {
        return res.status(400).json({ error: 'Wait for mentor to complete session before giving feedback' });
      }

      if (session.menteeFeedback && session.menteeFeedback.rating) {
        return res.status(400).json({ error: 'Feedback already submitted' });
      }

      if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
      }

      session.menteeFeedback = { rating, comment };
      await session.save();

      return res.json({ message: 'Feedback submitted successfully', session });
    }
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};





module.exports = {
  scheduleSession,
  getMySessions,
  submitFeedback
};
