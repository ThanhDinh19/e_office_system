const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendor = sequelize.define(
  'Vendor',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // uq_vendor_name (name)
    },
    contact_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // CURRENT_TIMESTAMP
    },
  },
  {
    tableName: 'vendors',
    timestamps: false,
  }
);

module.exports = Vendor;