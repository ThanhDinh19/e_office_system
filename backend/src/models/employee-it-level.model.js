const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeItLevel = sequelize.define(
  'EmployeeItLevel',
  {
    employee_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },

    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'employee_it_levels',
    timestamps: false,
  }
);

module.exports = EmployeeItLevel;
