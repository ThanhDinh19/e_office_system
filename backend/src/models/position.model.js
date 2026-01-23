const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Position = sequelize.define(
  'Position',
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
  },
  {
    tableName: 'positions',
    timestamps: false,
  }
);

module.exports = Position;
