const express = require("express");
const router = express.Router();
const { getMentorProfile } = require("../controllers/mentorController");
const { requireAuth } = require("../middleware/auth");

router.get("/:id", requireAuth, getMentorProfile);

module.exports = router;
