const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define(
  'Asset',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_code: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    name: DataTypes.STRING(100),
    category: DataTypes.STRING(50),
    model: DataTypes.STRING(50),
    serial: DataTypes.STRING(50),
    purchase_date: DataTypes.DATEONLY,
    price: DataTypes.DECIMAL(15, 2),
    warranty_end: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('stock', 'using', 'broken'),
      defaultValue: 'stock',
    },
  },
  {
    tableName: 'assets',
    timestamps: false,
  }
);

module.exports = Asset;
