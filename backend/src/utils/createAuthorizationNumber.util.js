const { Op } = require('sequelize');
const { Authorization } = require('../models');

const createAuthorizationNumber = async ({
  type = 'UQ',
  department = 'HR',
  employeeId,
  transaction,
}) => {
  const year = new Date().getFullYear();

  const count = await Authorization.count({
    where: {
      type,
      created_at: {
        [Op.gte]: new Date(`${year}-01-01`),
      },
    },
    transaction,
  });

  const runningNumber = String(count + 1).padStart(4, '0');
  const authorizationNo = `${type}/${year}/${department}/${runningNumber}`;

  const authorization = await Authorization.create(
    {
      authorization_no: authorizationNo,
      employee_id: employeeId, //  người tạo = người được ủy quyền
      type,
    },
    { transaction }
  );

  return authorization;
};

module.exports = createAuthorizationNumber;
