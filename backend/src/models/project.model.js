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
    name: DataTypes.STRING(150),
    manager_id: DataTypes.BIGINT,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
  },
  {
    tableName: 'projects',
    timestamps: false,
  }
);

module.exports = Project;
