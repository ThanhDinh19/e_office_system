
const bcrypt = require('bcryptjs');
const {sequelize, User, Role, Employee, Position, Department, EmployeeContract, SocialLink, CompanyInfo, Authorization } = require('../models');
const exportContract = require('../services/exportContract');
const createAuthorizationNumber = require('../utils/createAuthorizationNumber.util');

// có dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'is_login_disabled', 'is_inactive'],
      include: [
        {
          model: Role,
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: Employee,
          attributes: ['id', 'full_name', 'phone', 'avatar'],
          include: [
            {
              model: Position,
              attributes: ['name'], // tên chức vụ
            },
          ],
        },
      ],
    })

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load users' });
  }
};

// có dùng
// controllers/user.controller.js
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // tài khoản của chính mình

    // Không cho tự xóa chính mình
    if (String(id) === String(userId)) {
      return res.status(403).json({
        message: 'You cannot deactivate your own account',
      });
    }

    // 1️ Lấy user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️ Deactivate user
    await user.update({
      is_inactive: true,
      is_login_disabled: true,
    });

    // 3️ Nếu user không gắn employee (admin)
    if (!user.employee_id) {
      return res.json({ message: 'User deactivated successfully (no employee)' });
    }

    // 4️ Lấy employee bằng employee_id
    const employee = await Employee.findByPk(user.employee_id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 5️ Update employee status
    await employee.update({
      status: 'resigned',
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to deactivate user' });
  }
};


exports.createUser = async (req, res) => {
  const { username, email, password, roleIds, employeeId } = req.body;

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password_hash,
    employee_id: employeeId
  });

  await user.setRoles(roleIds);

  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, roleIds } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    if (roleIds && roleIds.length > 0) {
      await user.setRoles(roleIds);
    }

    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        attributes: ['name'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Không cho xóa ADMIN
    const isAdmin = user.Roles.some((r) => r.name === 'ADMIN');
    if (isAdmin) {
      return res
        .status(403)
        .json({ message: 'Không thể xóa tài khoản ADMIN' });
    }

    // Soft delete (khuyến nghị)
    user.status = 'deleted'; // hoặc 'locked' 
    await user.save();

    return res.json({
      message: 'Xóa người dùng thành công',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Xóa user thất bại' });
  }
};

exports.lockUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  user.status = user.status === 'active' ? 'locked' : 'active';
  await user.save();
  res.json({ status: user.status });
};

exports.resetPassword = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  user.password_hash = await bcrypt.hash('123456', 10);
  await user.save();
  res.json({ message: 'Password reset' });
};



// có dùng
exports.exportEmployeeContract = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // lấy từ token
    const t = await sequelize.transaction();
    // Lấy user trước, tim user của người xuất đơn để lấy được employee_id, khi có employee_id và tìm employee tức employee của người xuất đơn
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'employee_id',
        'is_login_disabled',
        'is_inactive',
      ],
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    // Nếu user KHÔNG gắn employee (admin)
    if (!user.employee_id) {
      return res.json({
        user,
        employee: null,
      });
    }

    // lấy thông tin của company
    const companyInfo = await CompanyInfo.findOne({
      attributes: [
        'company_name',
        'address',
        'phone',
        'tax_code',
        'bank_account',
        'representative_name',
        'representative_title',
      ],
    });


    // employee của người xuất đơn
    const authorizedPerson = await Employee.findByPk(user.employee_id, {
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
        {
          model: Position,
          attributes: ['id', 'name'],
        },
        {
          model: EmployeeContract,
          attributes: [
            'id',
            'employee_id',

            'contract_type',
            'contract_number',

            'start_date',
            'end_date',

            'probation_from',
            'probation_to',

            'duration_months',

            'workplace',
            'department_name',
            'job_title',
            'job_description',

            'salary',
            'salary_grade',
            'salary_level',

            'contract_file',

            'sign_date',
            'status',
          ],
        },
        {
          model: SocialLink,
          attributes: ['id', 'platform', 'url'],
        },
      ],
    });


    const authorization = await createAuthorizationNumber({
      type: 'UQ',
      department: 'HR',
      employeeId: authorizedPerson?.id,
      transaction: t,
    });

    // employe của người được xuất đơn
    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'is_login_disabled', 'is_inactive'],
          include: [
            {
              model: Role,
              attributes: ['id', 'name'],
              through: { attributes: [] }, // bỏ user_roles vào
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
          model: EmployeeContract,
          attributes: [
            'id',
            'employee_id',

            'contract_type',
            'contract_number',

            'start_date',
            'end_date',

            'probation_from',
            'probation_to',

            'duration_months',

            'workplace',
            'department_name',
            'job_title',
            'job_description',

            'salary',
            'salary_grade',
            'salary_level',
            'contract_file',

            'sign_date',
            'status',
          ],
        },
        {
          model: SocialLink,
          attributes: ['id', 'platform', 'url'],
        }
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const fileBuffer = await exportContract(employee, authorizedPerson, authorization, companyInfo);
    res.setHeader('Content-Disposition', 'attachment; filename=contract.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to export contract' });
  }
};

