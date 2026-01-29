const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Authorization = sequelize.define(
  'Authorization',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    authorization_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(20), // ví dụ: UQ
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'authorizations',
    timestamps: false, // vì dùng created_at thủ công
  }
);

module.exports = Authorization;
