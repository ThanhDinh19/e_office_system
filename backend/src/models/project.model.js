const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(150),
    },

    project_type: {
      type: DataTypes.ENUM('Client Project', 'Internal Project'),
    },

    description: {
      type: DataTypes.STRING(500),
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },

    labels: {
      type: DataTypes.ENUM(
        'High Priority',
        'On Track',
        'Perfect',
        'Upcoming',
        'Urgent'
      ),
    },

    manager_id: {
      type: DataTypes.BIGINT,
    },

    start_date: {
      type: DataTypes.DATEONLY,
    },

    end_date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: 'projects',
    timestamps: false,
  }
);

module.exports = Project;
