const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceSlaRule = sequelize.define(
  'ServiceSlaRule',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    priority_id: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },

    level: {
      type: DataTypes.TINYINT,
      allowNull: false, // 1,2,3
    },

    response_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    resolve_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    default_assignee_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    default_assignee_type: {
      type: DataTypes.ENUM('EMPLOYEE', 'VENDOR'),
      defaultValue: 'EMPLOYEE',
    },
  },
  {
    tableName: 'service_sla_rules',
    timestamps: false,
  }
);

module.exports = ServiceSlaRule;
