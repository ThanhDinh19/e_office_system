const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define(
  'Branch',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(100),
    address: DataTypes.STRING(255),
  },
  {
    tableName: 'branches',
    timestamps: false,
  }
);

module.exports = Branch;
