const sequelize = require('../config/database')

const Users = require('./users');

module.exports = { 
    sequelize,
    Users
}