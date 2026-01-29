const { sequelize, Employee, EmployeeContract, User, Role, UserRole, Department, Position, SocialLink } = require('../models');
const bcrypt = require('bcryptjs');
const { mapEmployeeData, mapContractData, mapUserData } = require('../mappers/employee.mapper');
const { mapSocialLinkData } = require('../mappers/social_link.mapper');
const { generateEmployeeCode } = require('../utils/employeeCode.util'); // tạo employee_code
const { Op } = require('sequelize');
const { mapEmployeeInfoData, mapEmployeeContract, mapEmployeeContractData } = require('../mappers/contract.mapper');
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

// // controllers/employee.controller.js
/**
 * GET /api/employees/me
 */
const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId; // lấy từ token

    // 1. Lấy user trước
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Nếu user KHÔNG gắn employee (admin)
    if (!user.employee_id) {
      return res.json({
        user,
        employee: null,
      });
    }

    // 3. Lấy employee theo employee_id
    const employee = await Employee.findByPk(user.employee_id, {
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

    return res.json({
      user,
      employee,
    });
  } catch (error) {
    next(error);
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
  const { id } = req.params;
  const socialLinks = req.body;

  if (!Array.isArray(socialLinks)) {
    return res.status(400).json({ message: 'Invalid social links data' });
  }

  const t = await sequelize.transaction();

  try {
    // 1️ Chuẩn hoá dữ liệu từ FE
    const normalizedLinks = socialLinks
      .filter(l => l.url && l.platform)
      .map(l => ({
        employee_id: id,
        platform: l.platform.toLowerCase().trim(),
        url: l.url.trim(),
      }));

    const incomingPlatforms = normalizedLinks.map(l => l.platform);

    // 2️ Upsert từng social link
    for (const link of normalizedLinks) {
      await SocialLink.upsert(
        {
          employee_id: link.employee_id,
          platform: link.platform,
          url: link.url,
        },
        { transaction: t }
      );
    }

    // 3️ Xoá các social link không còn tồn tại trên FE
    if (incomingPlatforms.length > 0) {
      await SocialLink.destroy({
        where: {
          employee_id: id,
          platform: { [Op.notIn]: incomingPlatforms },
        },
        transaction: t,
      });
    }

    await t.commit();
    res.json({ message: 'Social links updated successfully' });

  } catch (err) {
    await t.rollback();
    console.error('updateSocialLinks error:', err);
    res.status(500).json({ message: 'Failed to update social links' });
  }
};


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


const updateEmployeeContract = async (req, res) => {``
  const t = await sequelize.transaction();

  try {
    const { id } = req.params; // employee_id

    
    const employeeData = mapEmployeeInfoData(req.body);
    const employee = await Employee.findByPk(id, { transaction: t });

    if (!employee) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update(employeeData, { transaction: t });

    const contractData = mapEmployeeContractData(req.body, id);
  
    const contract = await EmployeeContract.findOne({
      where: { employee_id: id },
      order: [['created_at', 'DESC']], // nếu có nhiều hợp đồng
      transaction: t,
    });

    if (!contract) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee contract not found' });
    }

    await contract.update(contractData, { transaction: t });

    /* ================= COMMIT ================= */
    await t.commit();

    res.json({
      message: 'Employee & contract updated successfully',
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      message: 'Failed to update employee & contract',
    });
  }
};


/* ================= EMPLOYEE ================= */
    // const employeeData = {
    //   full_name: req.body.full_name,
    //   cccd: req.body.cccd,
    //   cccd_issue_date: req.body.cccd_issue_date || null,
    //   cccd_issue_place: req.body.cccd_issue_place || null,

    //   labor_book_number: req.body.labor_book_number || null,
    //   labor_book_issue_date: req.body.labor_book_issue_date || null,
    //   labor_book_issue_place: req.body.labor_book_issue_place || null,

    //   profession: req.body.profession || null,

    //   email: req.body.email,
    //   phone: req.body.phone,
    //   address: req.body.address,
    //   permanent_address: req.body.permanent_address,

    //   place_of_birth: req.body.place_of_birth,
    //   nationality: req.body.nationality,

    //   dob: req.body.dob || null,
    //   gender: req.body.gender,

    //   department_id: req.body.department_id || null,
    //   position_id: req.body.position_id || null,

    //   contract_type: req.body.contract_type,
    //   job_title: req.body.job_title,
    //   join_date: req.body.join_date || null,
    // };


     /* ================= CONTRACT ================= */
    // const contractData = {
    //   start_date: req.body.hireDate,
    //   end_date: req.body.endDate || null,

    //   contract_type: req.body.contract_type,
    //   contract_number: req.body.contract_number || null,

    //   probation_from: req.body.probation_from || null,
    //   probation_to: req.body.probation_to || null,

    //   duration_months: req.body.duration_months || null,

    //   workplace: req.body.workplace || null,
    //   job_title: req.body.job_title || null,
    //   job_description: req.body.job_description || null,

    //   salary: req.body.salary,
    //   salary_grade: req.body.salary_grade || null,
    //   salary_level: req.body.salary_level || null,

    //   sign_date: req.body.sign_date || null,
    //   status: req.body.contract_status || 'DRAFT',
    // };



module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  uploadAvatar,
  updateJobInfo,
  updateAccount,
  getSocialLinks,
  updateSocialLinks,
  getMyInfo,
  updateEmployeeContract,
};
