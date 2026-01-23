require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS for Render frontend
app.use(cors({
  origin: 'https://mr-pathfinder-frontend.onrender.com', // deployed frontend
  credentials: true
}));

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mr_pathfinder';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('Mr. Pathfinder API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
