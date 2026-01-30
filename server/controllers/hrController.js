const User = require('../models/User');

exports.searchCandidates = async (req, res) => {
  try {
    const { skill, minScore } = req.query;
    
    let query = { role: 'student' };
    
    if (skill) {
      const regex = new RegExp(skill, 'i');
      query.$or = [
        { careerGoal: regex },
        { interests: regex } // Matches if any element in array matches regex
      ];
    }
    
    if (minScore) {
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
