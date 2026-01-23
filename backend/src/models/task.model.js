const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    task_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: DataTypes.STRING(200),
    description: DataTypes.TEXT,
    assignee_id: DataTypes.BIGINT,
    deadline: DataTypes.DATE,
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
    },
    status: {
      type: DataTypes.ENUM('new', 'doing', 'review', 'done', 'cancel'),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'tasks',
    timestamps: false,
  }
);

module.exports = Task;
