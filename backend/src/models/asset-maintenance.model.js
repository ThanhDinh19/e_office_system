const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetMaintenance = sequelize.define(
  'AssetMaintenance',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    maintain_date: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    cost: DataTypes.DECIMAL(15, 2),
  },
  {
    tableName: 'asset_maintenances',
    timestamps: false,
  }
);

module.exports = AssetMaintenance;
