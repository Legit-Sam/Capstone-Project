// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed', err);
    process.exit(1);
  }
};

const seedMentees = async () => {
  await connectDB();

  const mentees = [];

  for (let i = 1; i <= 22; i++) {
    const email = `mentee${i}@example.com`;

    // Check if the email already exists
    const existing = await User.findOne({ email });
    if (!existing) {
      mentees.push({
        email,
        password: await bcrypt.hash(`menteepass${i}`, 10),
        role: 'MENTEE',
      });
    }
  }

  if (mentees.length === 0) {
    console.log('ℹ️ All mentee accounts already exist. Nothing to insert.');
    return process.exit();
  }

  try {
    const inserted = await User.insertMany(mentees);
    console.log(`✅ Added ${inserted.length} new mentees.`);
    process.exit();
  } catch (err) {
    console.error('❌ Failed to seed mentees:', err);
    process.exit(1);
  }
};

seedMentees();
