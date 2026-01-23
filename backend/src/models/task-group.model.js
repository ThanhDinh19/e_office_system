const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskGroup = sequelize.define(
  'TaskGroup',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: DataTypes.STRING(100),
  },
  {
    tableName: 'task_groups',
    timestamps: false,
  }
);

module.exports = TaskGroup;
