require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mr-pathfinder.vercel.app',
    'https://www.mr-pathfinder.vercel.app',
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
const { MongoMemoryServer } = require('mongodb-memory-server');

const seedPhoneNumbers = async () => {
  try {
    const students = await User.find({ 
      role: 'student', 
      $or: [{ phone: { $exists: false } }, { phone: '' }, { phone: null }] 
    });

    if (students.length > 0) {
      console.log(`Seeding phone numbers for ${students.length} students...`);
      for (const student of students) {
        // Generate random phone number (6-9 start, 10 digits)
        const firstDigit = Math.floor(Math.random() * 4) + 6;
        const rest = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        student.phone = `${firstDigit}${rest}`;
        await student.save();
      }
      console.log('Phone number seeding complete.');
    }
  } catch (err) {
    console.error('Phone seeding error:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pathfinder');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedPhoneNumbers();
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.log("Attempting to start In-Memory MongoDB fallback...");
    
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`Fallback: Connected to In-Memory MongoDB at ${uri}`);
      console.log("WARNING: Data will be lost when server restarts.");
    } catch (fallbackErr) {
      console.error(`Fallback failed: ${fallbackErr.message}`);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    }
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
