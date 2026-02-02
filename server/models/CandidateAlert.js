const mongoose = require('mongoose');

const CandidateAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  contactNumber: { type: String },
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CandidateAlert', CandidateAlertSchema);