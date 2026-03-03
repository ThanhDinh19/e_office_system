const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define(
  'Ticket',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    // map logical attribute `user_id` to actual DB column `requester_user_id`
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'requester_user_id',
    },

    priority_id: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 3,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // map `category` -> `subject_snapshot` in DB
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'subject_snapshot',
    },

    // map `description` -> `user_note` in DB
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_note',
    },

    // align status values with existing DB enum
    status: {
      type: DataTypes.ENUM(
        'NEW',
        'ASSIGNED',
        'IN_PROGRESS',
        'WAITING',
        'RESOLVED',
        'CLOSED',
        'CANCELLED'
      ),
      defaultValue: 'NEW',
    },

    current_level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    response_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    response_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // SLA columns in DB are named differently
    sla_status: {
      type: DataTypes.ENUM('ON_TIME', 'LATE'),
      allowNull: true,
      field: 'sla_response_status',
    },

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
