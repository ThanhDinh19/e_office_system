const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketPriority = sequelize.define(
  'TicketPriority',
  {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      // id 1..4, seed thủ công
      validate: {
        min: 1,
        max: 255,
      },
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'ticket_priorities',
    timestamps: false,
    underscored: true, // optional: nếu bạn muốn match naming kiểu snake_case
  }
);

module.exports = TicketPriority;