const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Roadmap = sequelize.define('Roadmap', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  phases: {
    type: DataTypes.JSON, // Store complex structure as JSON
    allowNull: false
  },
  projects: {
    type: DataTypes.JSON,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Roadmap;
