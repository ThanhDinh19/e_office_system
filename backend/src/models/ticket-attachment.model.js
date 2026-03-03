const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketAttachment = sequelize.define(
  'TicketAttachment',
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

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    file_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    uploaded_by: {
      type: DataTypes.BIGINT,
      allowNull: true, // user_id
    },

    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'ticket_attachments',
    timestamps: false,
  }
);

module.exports = TicketAttachment;
