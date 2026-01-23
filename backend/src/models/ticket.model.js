const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define(
  'Ticket',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category: DataTypes.STRING(100),
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('open', 'processing', 'closed'),
      defaultValue: 'open',
    },
    sla_deadline: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'tickets',
    timestamps: false,
  }
);

module.exports = Ticket;
