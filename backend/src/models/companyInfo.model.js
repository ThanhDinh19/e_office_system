const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyInfo = sequelize.define(
  'CompanyInfo',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
    },

    phone: {
      type: DataTypes.STRING(50),
    },

    tax_code: {
      type: DataTypes.STRING(50),
    },

    bank_account: {
      type: DataTypes.STRING(100),
    },

    representative_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    representative_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'company_info',
    timestamps: false,
  }
);

module.exports = CompanyInfo;
