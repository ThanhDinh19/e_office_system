const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username/email or password' });
    }

    // tìm user bằng username hoặc email
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username: username },
          { email: username }
        ]
      },
      include: {
        model: Role,
        through: { attributes: [] }, // bỏ user_roles
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // lấy danh sách role
    const roles = user.Roles.map(r => r.name);

    // kiểm ra is_login_enabled
    // if(user.is_login_disabled){
    //   return res.status(403).json({ message: 'Login is disabled for this account' });
    // }

    // tạo JWT
    const token = jwt.sign(
      {
        userId: user.id,
        roles,
      },
      process.env.JWT_SECRET, // Ký (sign) JWT khi login
      { expiresIn: '8h' }
    );

    res.json({
      token,  
      user: {
        id: user.id,
        username: user.username,
        roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
