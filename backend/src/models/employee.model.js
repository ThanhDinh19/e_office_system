const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define(
  'Employee',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_code: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
    department_id: DataTypes.INTEGER,
    position_id: DataTypes.INTEGER,
    job_title: DataTypes.STRING(100),
    dob: DataTypes.DATEONLY,
    cccd: DataTypes.STRING(20),
    email: DataTypes.STRING(100),
    phone: DataTypes.STRING(20),
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
    },
    join_date: DataTypes.DATEONLY,
    contract_type: DataTypes.STRING(50),
    status: {
      type: DataTypes.ENUM('active', 'resigned'),
      defaultValue: 'active',
    },
    created_at: DataTypes.DATE,
  },
  {
    tableName: 'employees',
    timestamps: false,
  }
);

module.exports = Employee;
