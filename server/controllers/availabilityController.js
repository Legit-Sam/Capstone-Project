const Availability = require('../models/Availability');

// Upsert mentor availability
const upsertAvailability = async (req, res) => {
  try {
    console.log('Incoming availability request:', req.body);

    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length < 3) {
      return res
        .status(400)
        .json({ error: 'At least 3 days of availability are required.' });
    }

    for (const slot of availability) {
      if (!slot.dayOfWeek || !slot.startTime || !slot.endTime) {
        return res
          .status(400)
          .json({ error: 'Each entry must include dayOfWeek, startTime, and endTime.' });
      }
    }

    const updated = await Availability.findOneAndUpdate(
      { mentorId: req.user.id },
      { mentorId: req.user.id, availability },
      { upsert: true, new: true }
    );

    return res.status(201).json(updated); // <-- make sure this line exists
  } catch (err) {
    console.error('Error saving availability:', err);
   return res.status(500).json({ error: 'Server error' });
  }
};

// Get current mentor's availability
const getMyAvailability = async (req, res) => {
  try {
    const data = await Availability.findOne({ mentorId: req.user.id });
    res.status(200).json(data || { availability: [] });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete mentor's availability entirely
const deleteAvailability = async (req, res) => {
  try {
    await Availability.deleteOne({ mentorId: req.user.id });
    res.json({ message: 'Availability cleared.' });
  } catch (err) {
    console.error('Error deleting availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMentorAvailability = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const availability = await Availability.findOne({ mentorId });
    if (!availability) {
      return res.status(404).json({ error: 'No availability found for this mentor' });
    }
    res.json(availability);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  upsertAvailability,
  getMyAvailability,
  deleteAvailability,
  getMentorAvailability
};
