const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeContract = sequelize.define(
  'EmployeeContract',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    /* ===== CONTRACT BASIC ===== */
    contract_type: {
      type: DataTypes.ENUM('PROBATION', 'FIXED_TERM', 'INDEFINITE'),
      allowNull: false,
    },

    contract_number: {
      type: DataTypes.STRING(50),
    },

    start_date: {
      type: DataTypes.DATEONLY,
    },

    end_date: {
      type: DataTypes.DATEONLY,
    },

    /* ===== SALARY ===== */
    salary: {
      type: DataTypes.DECIMAL(15, 2),
    },

    salary_grade: {
      type: DataTypes.STRING(50), // NGẠCH
    },

    salary_level: {
      type: DataTypes.INTEGER, // BẬC
    },

    contract_file: {
      type: DataTypes.STRING(255),
    },

    /* ===== PROBATION ===== */
    probation_from: {
      type: DataTypes.DATEONLY,
    },

    probation_to: {
      type: DataTypes.DATEONLY,
    },

    /* ===== FIXED TERM ===== */
    duration_months: {
      type: DataTypes.INTEGER,
    },

    /* ===== JOB INFO ===== */
    workplace: {
      type: DataTypes.STRING(255),
    },

    department_name: {
      type: DataTypes.STRING(100),
    },

    job_title: {
      type: DataTypes.STRING(100),
    },

    job_description: {
      type: DataTypes.TEXT,
    },

    /* ===== SIGN & STATUS ===== */
    sign_date: {
      type: DataTypes.DATEONLY,
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'EXPIRED'),
      defaultValue: 'DRAFT',
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'employee_contracts',
    timestamps: false,
  }
);

module.exports = EmployeeContract;
