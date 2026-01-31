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

const seedSampleData = async () => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    if (studentCount === 0) {
      console.log('Database empty. Seeding sample candidates for demo...');
      await User.create([
        {
          name: "Rahul Sharma",
          email: "rahul.demo@example.com",
          phone: "9876543210",
          password: "password123",
          role: "student",
          education: "B.Tech CS",
          interests: ["Web Development", "React"],
          skillLevel: "Intermediate",
          careerGoal: "Full Stack Developer",
          readinessScore: 85,
          streak: 12
        },
        {
          name: "Priya Patel",
          email: "priya.demo@example.com",
          phone: "8765432109",
          password: "password123",
          role: "student",
          education: "MCA",
          interests: ["Data Science", "Python"],
          skillLevel: "Advanced",
          careerGoal: "Data Scientist",
          readinessScore: 92,
          streak: 45
        },
        {
          name: "Amit Kumar",
          email: "amit.demo@example.com",
          phone: "7654321098",
          password: "password123",
          role: "student",
          education: "B.E. Electronics",
          interests: ["IoT", "Embedded Systems"],
          skillLevel: "Beginner",
          careerGoal: "IoT Engineer",
          readinessScore: 65,
          streak: 5
        }
      ]);
      console.log('Sample candidates seeded.');
    }
  } catch (err) {
    console.error('Sample seeding error:', err);
  }
};

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

const startInMemoryDB = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Fallback: Connected to In-Memory MongoDB at ${uri}`);
    console.log("WARNING: Data will be lost when server restarts.");
    await seedSampleData();
    // Also try to seed phone numbers for any non-sample users if they exist (unlikely in pure in-memory start, but good for consistency)
    await seedPhoneNumbers();
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
    await seedPhoneNumbers();
    await seedSampleData();
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

startServer();
