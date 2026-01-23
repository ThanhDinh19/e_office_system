const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    project_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    role_in_project: DataTypes.STRING(50),
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'project_members',
    timestamps: false,
  }
);

module.exports = ProjectMember;
