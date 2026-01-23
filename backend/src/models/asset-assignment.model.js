const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetAssignment = sequelize.define(
  'AssetAssignment',
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
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assigned_date: DataTypes.DATEONLY,
    returned_date: DataTypes.DATEONLY,
  },
  {
    tableName: 'asset_assignments',
    timestamps: false,
  }
);

module.exports = AssetAssignment;
