const bcrypt = require('bcryptjs');
const { sequelize, User, EmployeeContract, UserRole } = require('../models');

const createDefaultUsers = async () => {
  const t = await sequelize.transaction();

  try {
    const DEFAULT_USERS = [
      {
        employee_id: 1,
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        role_id: 1, // ADMIN
        contract_type: 'INDEFINITE',
        salary: 30000000,
      },
      {
        employee_id: 2,
        username: 'hr01',
        email: 'hr@company.com',
        password: 'hr123',
        role_id: 4, // HR
        contract_type: 'FIXED_TERM',
        salary: 20000000,
      },
      {
        employee_id: 3,
        username: 'it01',
        email: 'it@company.com',
        password: 'it123',
        role_id: 5, // IT
        contract_type: 'FIXED_TERM',
        salary: 25000000,
      },
      {
        employee_id: 4,
        username: 'staff01',
        email: 'staff1@company.com',
        password: 'staff123',
        role_id: 3, // STAFF
        contract_type: 'PROBATION',
        salary: 12000000,
      },
      {
        employee_id: 5,
        username: 'staff02',
        email: 'staff2@company.com',
        password: 'staff123',
        role_id: 3, // STAFF
        contract_type: 'PROBATION',
        salary: 12000000,
      },
      {
        employee_id: 6,
        username: 'manager01',
        email: 'manager@company.com',
        password: 'manager123',
        role_id: 2, // MANAGER
        contract_type: 'INDEFINITE',
        salary: 40000000,
      },
    ];

    for (const u of DEFAULT_USERS) {
      /** 1️ Check user tồn tại */
      const existingUser = await User.findOne({
        where: { email: u.email },
        transaction: t,
      });

      if (existingUser) {
        console.log(`User ${u.email} already exists → skip`);
        continue;
      }

      /** 2️ Create contract */
      await EmployeeContract.create(
        {
          employee_id: u.employee_id,
          contract_type: u.contract_type,
          salary: u.salary,
          status: 'ACTIVE',
        },
        { transaction: t }
      );

      /** 3️ Hash password */
      const password_hash = await bcrypt.hash(u.password, 10);

      /** 4️ Create user */
      const user = await User.create(
        {
          employee_id: u.employee_id,
          username: u.username,
          email: u.email,
          password_hash,
        },
        { transaction: t }
      );

      /** 5️ Assign role (user_roles) */
      await UserRole.create(
        {
          user_id: user.id,
          role_id: u.role_id,
        },
        { transaction: t }
      );

      console.log(` Created user + contract + role: ${u.username}`);
    }

    await t.commit();
    console.log('🎉 Seeded users + contracts + roles successfully');
  } catch (error) {
    await t.rollback();
    console.error(' Seed failed:', error);
    process.exit(1);
  }
};

module.exports = createDefaultUsers;
