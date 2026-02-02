const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  contactNumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'hr'], default: 'student' },
  
  // Student Specifics
  dateOfBirth: { type: Date },
  consent: { type: Boolean, required: true, default: false },
  
  education: { type: String }, // Stores "Course / Education"
  currentCourse: { type: String }, // Optional separation if needed
  interests: [{ type: String }],
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  careerGoal: { type: String },
  
  // App Mechanics
  readinessScore: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
