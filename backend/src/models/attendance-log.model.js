const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceLog = sequelize.define(
  'AttendanceLog',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    check_time: DataTypes.DATE,
    type: {
      type: DataTypes.ENUM('in', 'out'),
    },
    source: {
      type: DataTypes.ENUM('machine', 'gps', 'wifi', 'manual'),
    },
  },
  {
    tableName: 'attendance_logs',
    timestamps: false,
  }
);

module.exports = AttendanceLog;
