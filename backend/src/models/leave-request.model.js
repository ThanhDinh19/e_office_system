const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define(
  'LeaveRequest',
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
    leave_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_date: DataTypes.DATEONLY,
    to_date: DataTypes.DATEONLY,
    reason: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    created_at: DataTypes.DATE,
  },
  {
    tableName: 'leave_requests',
    timestamps: false,
  }
);

module.exports = LeaveRequest;
