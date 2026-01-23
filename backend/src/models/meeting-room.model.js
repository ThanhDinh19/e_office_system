const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingRoom = sequelize.define(
  'MeetingRoom',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: DataTypes.STRING(100),
    location: DataTypes.STRING(100),
    capacity: DataTypes.INTEGER,
  },
  {
    tableName: 'meeting_rooms',
    timestamps: false,
  }
);

module.exports = MeetingRoom;
