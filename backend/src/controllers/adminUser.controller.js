
const bcrypt = require('bcryptjs');
const { User, Role, Employee, Position, Department } = require('../models');
const exportContract = require('../services/exportContract');

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
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load users' });
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


exports.exportContract = async (req, res) => {
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

        }
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const fileBuffer = await exportContract(employee);
    res.setHeader('Content-Disposition', 'attachment; filename=contract.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to export contract' });
  }
};