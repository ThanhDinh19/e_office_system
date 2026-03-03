const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItSupportLevel = sequelize.define(
  'ItSupportLevel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'it_support_levels',
    timestamps: false,
  }
);

module.exports = ItSupportLevel;
