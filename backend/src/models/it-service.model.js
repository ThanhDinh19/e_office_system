const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItService = sequelize.define(
  'ItService',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    service_group: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    target_object: {
      type: DataTypes.ENUM('User', 'IT', 'Admin', 'System', 'All'),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'it_services',
    timestamps: false,
  }
);

module.exports = ItService;
