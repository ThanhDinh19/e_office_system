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
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    salary: DataTypes.DECIMAL(15, 2),
    contract_file: DataTypes.STRING(255),
  },
  {
    tableName: 'employee_contracts',
    timestamps: false,
  }
);

module.exports = EmployeeContract;
