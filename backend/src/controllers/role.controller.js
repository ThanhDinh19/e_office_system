const { Role } = require('../models');

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
    });

    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load roles' });
  }
};