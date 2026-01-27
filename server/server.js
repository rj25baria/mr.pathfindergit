require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mr-pathfinder.vercel.app/',
    'https://rj25baria.github.io',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

app.get('/', (req, res) => {
  res.send('Mr. Pathfinder API is running');
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      // Don't crash the app, just log the error. The app can still serve requests using MockDB if configured.
      console.log('Continuing without MongoDB connection...');
    });
} else {
  console.log('No MONGO_URI provided. Using Mock Database (in-memory). Data will not persist across restarts.');
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
