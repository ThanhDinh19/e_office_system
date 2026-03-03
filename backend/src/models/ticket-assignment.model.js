const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketAssignment = sequelize.define(
  'TicketAssignment',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    ticket_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    support_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // employees.id
    },

    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: 'Snapshot IT support level at assignment time',
    },

    sla_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    response_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    response_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    assignment_type: {
      type: DataTypes.ENUM('AUTO', 'MANUAL'),
      defaultValue: 'AUTO',
    },
  },
  {
    tableName: 'ticket_assignments',
    timestamps: false,
  }
);

module.exports = TicketAssignment;
