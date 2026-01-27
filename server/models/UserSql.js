const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student',
    validate: {
      isIn: [['student', 'hr', 'admin']]
    }
  },
  education: {
    type: DataTypes.STRING
  },
  interests: {
    type: DataTypes.JSON, // Store as JSON string in SQLite
    defaultValue: []
  },
  skillLevel: {
    type: DataTypes.STRING
  },
  careerGoal: {
    type: DataTypes.STRING
  },
  readinessScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});

module.exports = User;
