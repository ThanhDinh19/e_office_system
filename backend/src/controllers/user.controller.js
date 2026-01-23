const {sequelize, User} = require('../models');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'is_login_disabled', 'is_inactive'],
    });
    res.json(users);
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: 'Failed to load users' });
  }
};