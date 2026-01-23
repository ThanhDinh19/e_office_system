const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define(
  'Department',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'departments',
    timestamps: false,
  }
);

module.exports = Department;
