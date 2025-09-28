require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('./logger'); // ✅ Import the logger

const sequelize = new Sequelize(
  process.env.POSTGRES_DBNAME,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT,
    logging: (msg) => logger.info(`Sequelize: ${msg}`), // ✅ Log SQL queries
  }
);

// Export only the sequelize instance here
module.exports = sequelize;
