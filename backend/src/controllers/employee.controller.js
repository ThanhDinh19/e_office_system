const { sequelize, Employee, EmployeeContract, User, Role, UserRole, Department, Position, SocialLink } = require('../models');
const bcrypt = require('bcryptjs');
const { mapEmployeeData, mapContractData, mapUserData } = require('../mappers/employee.mapper');
const { mapSocialLinkData } = require('../mappers/social_link.mapper');
const { generateEmployeeCode } = require('../utils/employeeCode.util'); // tạo employee_code
/**
 * GET /api/employees
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    next(error); // đẩy lỗi về global error handler
  }
};

/**
 * GET /api/employees/:id
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'is_login_disabled', 'is_inactive'],
          include: [
            {
              model: Role,
              attributes: ['id', 'name'],
              through: { attributes: [] }, // bỏ user_roles
            },
          ],
        },
        {
          model: Department,
          attributes: ['id', 'name'],
        },
        {
          model: Position,
          attributes: ['id', 'name'],
        },
        {
          model: SocialLink,
          attributes: ['id', 'platform', 'url'],
        }
      ],
    });

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
};


/**
 * POST /api/employees
 */
const createEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // 1. Map employee
    // const employeeData = mapEmployeeData(req.body);
    const year = new Date(req.body.hireDate).getFullYear(); // lấy ngày vào làm để tạo mã

    const employee_code = await generateEmployeeCode(year, t); // tạo employee_code tự động

    const employeeData = {
      ...mapEmployeeData(req.body),
      employee_code,
    };

    const employee = await Employee.create(employeeData, { transaction: t });

    // 2. Map contract
    const contractData = mapContractData(req.body, employee.id);

    await EmployeeContract.create(contractData, { transaction: t });

    // 3. Map user (optional)
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const userData = mapUserData(req.body, employee.id, hashedPassword);

      // 3 create user
      const user = await User.create(userData, { transaction: t });

      //4. Assign role
      await UserRole.create(
        {
          user_id: user.id,
          role_id: Number(req.body.role_id),
        },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({ message: 'Employee created' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

const updateJobInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employee_code,
      department,
      position,
      job_title,
      contract,
    } = req.body;

    // 1.Find employee
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // 2️Update allowed fields
    await employee.update({
      employee_code,
      job_title,
      contract_type: contract,
      department_id: department || null,
      position_id: position || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Failed to update job info',
    });
  }
}


const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      email,
      password,
      confirm_password,
      role,
      is_login_disabled,
      is_inactive,
    } = req.body;

    // 1.Find user
    const user = await User.findOne({ where: { employee_id: id } });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    // 2️.Update allowed fields
    if (email) {
      user.email = email;
    }

    if (password && confirm_password && password === confirm_password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password_hash = hashedPassword;
    }

    if (role) {
      // Remove existing roles
      await UserRole.destroy({ where: { user_id: user.id } });
      // Assign new role
      await UserRole.create({
        user_id: user.id,
        role_id: Number(role),
      });
    }

    if (is_login_disabled !== undefined) {
      user.is_login_disabled = is_login_disabled;
    }

    if (is_inactive !== undefined) {
      user.is_inactive = is_inactive;
    }

    await user.save();

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Failed to update account info',
    });
  }
}


const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      cccd,
      address,
      email,
      phone,
      dob,
      gender,
    } = req.body;

    // 1.Find employee
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // 2.Validate cơ bản
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({
        message: 'Full name is required',
      });
    }

    if (dob && isNaN(new Date(dob).getTime())) {
      return res.status(400).json({
        message: 'Invalid date of birth',
      });
    }

    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        message: 'Invalid gender value',
      });
    }

    // 3️.Update allowed fields
    await employee.update({
      full_name,
      cccd,
      address: address || null,
      email,
      phone,
      dob: dob || null,
      gender,
    });

    // 4️.Response
    res.json({
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update employee',
    });
  }
};



const updateSocialLinks = async (req, res) => {
  const { employeeId } = req.params;
  const socialLinks = req.body; // ARRAY

  if (!Array.isArray(socialLinks)) {
    return res.status(400).json({ message: 'Invalid social links data' });
  }

  const t = await sequelize.transaction();

  try {
    // 1️ Lấy các link hiện có trong DB
    const existingLinks = await SocialLink.findAll({
      where: { employee_id: employeeId },
      transaction: t,
    });

    const existingMap = new Map(
      existingLinks.map(l => [l.id, l])
    );

    const incomingIds = [];

    // 2️ Update hoặc Create
    for (const link of socialLinks) {
      if (!link.url) continue; // bỏ link rỗng

      if (link.id && existingMap.has(link.id)) {
        // UPDATE
        await SocialLink.update(
          {
            platform: link.platform,
            url: link.url,
          },
          {
            where: { id: link.id },
            transaction: t,
          }
        );

        incomingIds.push(link.id);
      } else {
        // CREATE
        const created = await SocialLink.create(
          {
            employee_id: employeeId,
            platform: link.platform,
            url: link.url,
          },
          { transaction: t }
        );

        incomingIds.push(created.id);
      }
    }

    // 3️. xóa các link bị remove khỏi UI
    const toDelete = existingLinks
      .filter(l => !incomingIds.includes(l.id))
      .map(l => l.id);

    if (toDelete.length > 0) {
      await SocialLink.destroy({
        where: { id: toDelete },
        transaction: t,
      });
    }

    await t.commit();
    res.json({ message: 'Social links updated successfully' });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to update social links' });
  }
};

module.exports = { updateSocialLinks };



const uploadAvatar = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const avatarUrl = `/public/avatars/${req.file.filename}`;

  await Employee.update(
    { avatar: avatarUrl },
    { where: { id } }
  );

  res.json({
    message: 'Avatar updated',
    avatar: avatarUrl,
  });
};

const getSocialLinks = async (req, res) => {
  const { id } = req.params;

  try {
    const socialLinks = await SocialLink.findAll({
      where: { employee_id: id },
      order: [['display_order', 'ASC']],
    });

    res.json(socialLinks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to get social links',
    });
  }
};


module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  uploadAvatar,
  updateJobInfo,
  updateAccount,
  getSocialLinks,
};
