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

    permanent_address: DataTypes.STRING(255),

    department_id: DataTypes.INTEGER,

    position_id: DataTypes.INTEGER,

    job_title: DataTypes.STRING(100),

    dob: DataTypes.DATEONLY,

    /* ===== PERSONAL INFO ===== */
    place_of_birth: {
      type: DataTypes.STRING(255),
    },

    nationality: {
      type: DataTypes.STRING(50),
    },

    /* ===== CCCD ===== */
    cccd: {
      type: DataTypes.STRING(20),
    },

    cccd_issue_date: {
      type: DataTypes.DATEONLY,
    },

    cccd_issue_place: {
      type: DataTypes.STRING(255),
    },

    /* ===== LABOR BOOK ===== */
    labor_book_number: {
      type: DataTypes.STRING(50),
    },

    labor_book_issue_date: {
      type: DataTypes.DATEONLY,
    },

    labor_book_issue_place: {
      type: DataTypes.STRING(255),
    },

    profession: {
      type: DataTypes.STRING(100),
    },

    /* ===== CONTACT ===== */
    email: DataTypes.STRING(100),

    phone: DataTypes.STRING(20),

    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
    },

    /* ===== JOB ===== */
    join_date: DataTypes.DATEONLY,

    contract_type: DataTypes.STRING(50),

    /* ===== SYSTEM ===== */
    status: {
      type: DataTypes.ENUM('active', 'resigned'),
      defaultValue: 'active',
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'employees',
    timestamps: false,
  }
);

module.exports = Employee;
