const { Employee } = require('../models');

exports.generateEmployeeCode = async (year, transaction) => {
  const count = await Employee.count({
    where: {
      employee_code: {
        [require('sequelize').Op.like]: `EMP-${year}-%`,
      },
    },
    transaction,
  });

  const nextNumber = String(count + 1).padStart(4, '0');

  return `EMP-${year}-${nextNumber}`;
};
