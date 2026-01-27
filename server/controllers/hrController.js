const User = require('../models/UserSql');
const { Op } = require('sequelize');

exports.searchCandidates = async (req, res) => {
  try {
    const { skill, minScore } = req.query;
    
    let where = { role: 'student' };
    
    if (skill) {
      // In SQLite/Sequelize, we can use Op.like for pattern matching
      // Since interests is JSON string, checking containment might be tricky in pure SQLite without extensions
      // We will check careerGoal OR verify if skill is in interests string
      where[Op.or] = [
        { careerGoal: { [Op.like]: `%${skill}%` } },
        { interests: { [Op.like]: `%${skill}%` } } // Simple string check on JSON
      ];
    }
    
    if (minScore) {
      where.readinessScore = { [Op.gte]: parseInt(minScore) };
    }
    
    const candidates = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['readinessScore', 'DESC']]
    });
      
    res.status(200).json({ success: true, count: candidates.length, data: candidates });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
