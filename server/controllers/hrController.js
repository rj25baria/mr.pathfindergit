const User = require('../models/User');
const CandidateAlert = require('../models/CandidateAlert');
const seedCandidates = require('../seedData');

exports.searchCandidates = async (req, res) => {
  try {
    const { skill, minScore } = req.query;
    
    // Just-in-Time Seeding: If no candidates exist at all, seed them now.
    const totalStudents = await User.countDocuments({ role: 'student' });
    if (totalStudents === 0) {
        console.log("No candidates found in DB. Triggering JIT Seeding...");
        await seedCandidates(User);
    }

    let query = { role: 'student' };
    
    if (skill && skill.trim()) {
      const regex = new RegExp(skill, 'i');
      query.$or = [
        { name: regex },        // Search by Name
        { careerGoal: regex },  // Search by Career Goal
        { interests: regex }    // Search by Interests
      ];
    }
    
    if (minScore && minScore.trim()) {
      query.readinessScore = { $gte: parseInt(minScore) };
    }
    
    // Use lean() for faster read performance
    const candidates = await User.find(query)
      .select('-password')
      .sort({ readinessScore: -1 })
      .lean();
      
    // Robust Duplicate Removal (In-Memory)
    // Keep the entry with the highest readinessScore or most recent activity
    const uniqueMap = new Map();
    
    candidates.forEach(candidate => {
        const email = candidate.email.toLowerCase();
        if (!uniqueMap.has(email)) {
            uniqueMap.set(email, candidate);
        } else {
            // If we have a duplicate, keep the "better" one (higher score)
            const existing = uniqueMap.get(email);
            if ((candidate.readinessScore || 0) > (existing.readinessScore || 0)) {
                uniqueMap.set(email, candidate);
            }
        }
    });
    
    const uniqueCandidates = Array.from(uniqueMap.values());

    res.status(200).json({ success: true, count: uniqueCandidates.length, data: uniqueCandidates });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.resetCandidates = async (req, res) => {
    try {
        await User.deleteMany({ role: 'student' });
        await seedCandidates(User);
        res.status(200).json({ success: true, message: 'Candidates reset and re-seeded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Fetch candidate alerts (recent signups forwarded to HR)
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await CandidateAlert.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Debug: Get all students (no auth required for testing)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .lean();
        console.log(`Debug: Found ${students.length} students in database`);
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Accept external notifications (simple endpoint to forward student info to HR alerts)
exports.notifyCandidate = async (req, res) => {
    try {
        const { name, email, phone, contactNumber, userId } = req.body;
        if (!email || !name) return res.status(400).json({ success: false, message: 'Missing required fields' });
        const alert = await CandidateAlert.create({ name, email, phone, contactNumber, userId });
        res.status(201).json({ success: true, data: alert });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.cleanDuplicates = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).sort({ readinessScore: -1 });
        const seen = new Set();
        const toDelete = [];

        for (const user of users) {
            if (seen.has(user.email.toLowerCase())) {
                toDelete.push(user._id);
            } else {
                seen.add(user.email.toLowerCase());
            }
        }

        if (toDelete.length > 0) {
            await User.deleteMany({ _id: { $in: toDelete } });
        }

        res.status(200).json({ success: true, message: `Removed ${toDelete.length} duplicate candidates`, count: toDelete.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (user.role !== 'student') {
        return res.status(400).json({ success: false, message: 'Cannot delete non-student accounts via this endpoint' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'Candidate removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { phone, email } = req.body;
    
    // Only allow updating specific fields for now
    if (!phone && !email) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (user.role !== 'student') {
        return res.status(400).json({ success: false, message: 'Cannot update non-student accounts via this endpoint' });
    }

    if (phone) user.phone = phone;
    if (email) user.email = email;
    
    await user.save();

    res.status(200).json({ success: true, data: user, message: 'Candidate contact info updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
