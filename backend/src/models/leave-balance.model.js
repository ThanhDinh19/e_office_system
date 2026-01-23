const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveBalance = sequelize.define(
  'LeaveBalance',
  {
    employee_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    total_days: DataTypes.INTEGER,
    used_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'leave_balances',
    timestamps: false,
  }
);

module.exports = LeaveBalance;


