require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const { sequelize } = require('./models');
const { Users } = require('./models');
const bcrypt = require('bcrypt');
const logger = require('./config/logger');

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('views'));

// Routes
app.use('/uploads', express.static('uploads'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

// Web Based Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// To confirm middleware is working:
app.use((req, res, next) => {
  logger.debug(`🛡️ Middleware => Incoming request Method[${req.method}] URL[${req.url}]`);
  // logger.debug(`🛡️ Middleware => Request body => ${req.body}`);
  next();
});

// Creating Default Admin User [Should be deleted and created new one]
async function createDefaultUserIfNoneExists() {
  logger.info(`🔍 Searching Default Admin Account => ${process.env.APP_DEFAULT_USER}`);
  const existingUser = await Users.findByPk(process.env.APP_DEFAULT_USER);
  if (!existingUser) { 
    logger.info('⚠️  Default user does not exists. Creating . . .');
    try{
      const hashedPassword = await bcrypt.hash(process.env.APP_DEFAULT_PWD, 10);
      await Users.create({
        loginid: process.env.APP_DEFAULT_USER,
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
      });
      logger.info(`✅ Default admin user created: ${process.env.APP_DEFAULT_USER } / ${process.env.APP_DEFAULT_PWD}`);     
    }catch(err){
      logger.info(`❌ Default admin user creation failed!!`); 
      logger.debug(`❌ Traces => ${err}`);   
    }    
  }else {
    logger.info('👍 Default user already exists. Skipping creation.');
  }
}

// DB connection
sequelize.authenticate()
  .then(async () => {
    logger.info('✅ Connected to PostgreSQL database');
    // Only create default user in non production
    if (process.env.APP_ENV.toLowerCase === 'production') {
      logger.info('🚫 Skipping default user creation in production');
    } else {
      logger.info('🧑⚙️  Setting up admin user account');
      await createDefaultUserIfNoneExists();
    }
  })
  .catch((err) => {
    logger.error(`❌ Database connection failed: ${err.message}`);
    logger.trace(`Trace => ${err}`);
  });

module.exports = app;