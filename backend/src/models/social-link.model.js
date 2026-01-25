const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialLink = sequelize.define(
  'SocialLink',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'facebook, linkedin, github, website, zalo...',
    },

    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },

    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'social_links',
    timestamps: false,
    underscored: true,

    // BẮT BUỘC để upsert hoạt động đúng
    indexes: [
      {
        unique: true,
        fields: ['employee_id', 'platform'],
        name: 'uniq_employee_platform',
      },
    ],
  }
);

module.exports = SocialLink;
