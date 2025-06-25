const User = require("../models/User");
const Availability = require("../models/Availability");

// GET /mentors/:id
const getMentorProfile = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!mentor || mentor.role !== "MENTOR") {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const availabilityDoc = await Availability.findOne({ mentorId: mentor._id }).lean();

    mentor.availability = availabilityDoc?.availability || [];

    res.json(mentor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getMentorProfile };
