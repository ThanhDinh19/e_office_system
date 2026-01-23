const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskComment = sequelize.define(
  'TaskComment',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    comment: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'task_comments',
    timestamps: false,
  }
);

module.exports = TaskComment;
