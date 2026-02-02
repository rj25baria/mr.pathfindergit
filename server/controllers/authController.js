const User = require('../models/User');
const CandidateAlert = require('../models/CandidateAlert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token Generator
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  const isProduction = process.env.NODE_ENV === 'production';
  
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        readinessScore: user.readinessScore
      }
    });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { 
        name, email, phone, contactNumber, password, role, 
        education, interests, careerGoal,
        dateOfBirth, consent 
    } = req.body;

    // 1. Validation
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    if (role === 'student' && !consent) {
        return res.status(400).json({ success: false, message: 'You must agree to the terms and conditions.' });
    }

    // Phone Format Check (Simple 10 digit)
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number.' });
    }

    // Optional Contact Number validation
    let contactClean;
    if (contactNumber) {
        contactClean = (contactNumber || '').replace(/\D/g, '');
        if (contactClean.length !== 10) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit contact number.' });
        }
    }

    // 2. Check Duplicates
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phoneClean,
      contactNumber: contactClean,
      password: hashedPassword,
      role: role || 'student',
      
      // Student Fields
      education, // Course
      interests: interests ? (Array.isArray(interests) ? interests : [interests]) : [],
      careerGoal,
      dateOfBirth,
      consent: !!consent,
      
      // Defaults
      readinessScore: 50, // Start with some score
      streak: 1
    });

    // Notify HR portal by creating a candidate alert so HR users see new signups
    try {
        if (user.role === 'student') {
            await CandidateAlert.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                contactNumber: user.contactNumber
            });
        }
    } catch (alertErr) {
        console.error('Candidate alert create error:', alertErr);
    }

    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check User
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, data: {} });
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: user, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};
