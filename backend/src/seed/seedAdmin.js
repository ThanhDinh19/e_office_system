const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

const createDefaultUsers = async () => {
  try {
    const DEFAULT_USERS = [
      {
        employee_id: 1,
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
      },
      {
        employee_id: 3,
        username: 'it01',
        email: 'it@company.com',
        password: 'it123',
      },
      {
        employee_id: 4,
        username: 'staff01',
        email: 'staff1@company.com',
        password: 'staff123',
      },
      {
        employee_id: 5,
        username: 'staff02',
        email: 'staff2@company.com',
        password: 'staff123',
      },
      {
        employee_id: 6,
        username: 'manager01',
        email: 'manager@company.com',
        password: 'manager123',
      },
    ];

    for (const user of DEFAULT_USERS) {
      // kiểm tra tồn tại 
      const existingUser = await User.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        console.log(`User ${user.email} already exists, skip`);
        continue;
      }

      // hash password
      const password_hash = await bcrypt.hash(user.password, 10);

      // tạo user mới
      await User.create({
        employee_id: user.employee_id,
        username: user.username,
        email: user.email,
        password_hash,
      });

      console.log(`Created user: ${user.username}`);
    }

    console.log('Default users seeded successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

module.exports = createDefaultUsers;
