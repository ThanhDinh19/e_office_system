const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: DataTypes.STRING(100),

     // Disable / Enable login
    is_login_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Mark as inactive
    is_inactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    last_login: DataTypes.DATE,
    created_at: DataTypes.DATE,
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = User;
