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
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://mr-pathfinder.vercel.app',
      'https://www.mr-pathfinder.vercel.app',
      'https://rj25baria.github.io',
      process.env.FRONTEND_URL
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
const seedCandidates = require('./seedData');

const startInMemoryDB = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Fallback: Connected to In-Memory MongoDB at ${uri}`);
    console.log("WARNING: Data will be lost when server restarts.");
    await seedCandidates(User);
  } catch (fallbackErr) {
    console.error(`Fallback failed: ${fallbackErr.message}`);
  }
};

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/pathfinder';

  // In production, if no valid remote URI is provided, default to In-Memory to avoid crashes
  if (isProduction && (mongoURI.includes('localhost') || !mongoURI)) {
    console.log("Production environment detected without a valid cloud MongoDB URI.");
    console.log("Starting In-Memory Database (Demo Mode)...");
    return startInMemoryDB();
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedCandidates(User);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.log("Attempting to start In-Memory MongoDB fallback...");
    await startInMemoryDB();
  }
};

// Start Server only after DB connects
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.connectDB = connectDB;
