const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveApproval = sequelize.define(
  'LeaveApproval',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    leave_request_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    approver_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('manager', 'hr'),
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    },
    approved_at: DataTypes.DATE,
  },
  {
    tableName: 'leave_approvals',
    timestamps: false,
  }
);

module.exports = LeaveApproval;
