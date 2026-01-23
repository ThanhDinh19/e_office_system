const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomBooking = sequelize.define(
  'RoomBooking',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    organizer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    meeting_subject: DataTypes.STRING(255),
    booking_note: DataTypes.TEXT,
  },
  {
    tableName: 'room_bookings',
    timestamps: false,
  }
);

module.exports = RoomBooking;
