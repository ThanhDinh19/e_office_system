const {Position} = require('../models');

exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.findAll();
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};