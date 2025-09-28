require('dotenv').config();
const { sequelize, Users } = require('../models');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { testContext, timeout } = require('./control');

let adminUser;

before(async function () {
  logger.info('🔧 Global setup before all tests');
  this.timeout(timeout || 10000);

  try {
    await sequelize.authenticate();
    logger.info('✅ Connected to PostgreSQL database');

    const hashedPassword = await bcrypt.hash(process.env.APP_DEFAULT_PWD, 10);
    const [adminUser, created] = await Users.findOrCreate({
      where: { loginid: process.env.APP_DEFAULT_USER },
      defaults: {        
        pwdhash: hashedPassword,
        fullname: 'Default Admin',
        email: 'admin@default.com',
        email_verified: true,
        is_active: true,
        phone_number: '1234567890',
        phone_verified: true,
        date_of_birth: new Date('1985-10-15'),
        userrole: 'admin',
        profile_image: './uploads/default.jpeg'
      }
    });
   
    if (created) {
      logger.info('✅ Default user created');
    } else {
      logger.info(`✅ Default user already exists.`);
    }    
    testContext.adminPass = process.env.APP_DEFAULT_PWD;
    testContext.adminUser = adminUser;
    logger.debug(`💾 Set testContext.adminUser`);
    logger.info(`💾 Test user context set for loginid => ${testContext.adminUser.loginid}`);
  } catch (err) {
    logger.error('❌ Error during global setup');
    logger.trace('❌ Error details:', err);
    throw err; // Ensure test suite fails if setup fails
  }
});


after(async () => {
  if (adminUser) {
    await adminUser.destroy();
    logger.info('🧹 Test admin user removed from database');
  }
});

