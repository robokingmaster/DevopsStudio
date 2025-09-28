const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // adjust path as needed

const Users = sequelize.define('Users', {
  loginid: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  pwdhash: {
    type: DataTypes.STRING(100)
  },
  fullname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    validate: {
      isEmail: true
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profile_image: {
    type: DataTypes.STRING(100)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  phone_number: {
    type: DataTypes.STRING(10)
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  userrole: {
    type: DataTypes.STRING(10)
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  schema: 'portfolio',
  timestamps: true, // 👈 This enables createdAt and updatedAt
});

module.exports = Users;
