// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const requestRoutes = require('./routes/requests');
const availabilityRoutes = require('./routes/availability');
const sessionRoutes = require('./routes/sessions');
const mentorRoutes = require('./routes/mentor');
const connectDB = require('./config/database');


dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://capstone-project-seven-ecru.vercel.app'],
  credentials: true, // Allow cookies to be sent with requests
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/sessions', sessionRoutes);
app.use("/api/mentors", mentorRoutes);
// Error handling

connectDB();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));