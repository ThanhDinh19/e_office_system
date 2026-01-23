const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingParticipant = sequelize.define(
  'MeetingParticipant',
  {
    booking_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  },
  {
    tableName: 'meeting_participants',
    timestamps: false,
  }
);

module.exports = MeetingParticipant;
