require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const logger = require('../config/logger');

exports.register = async (req, res) => {
  const { loginid, password, fullname, email, email_verified, is_active, phone_number, phone_verified, date_of_birth, userrole } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  const existing = await Users.findOne({ where: { loginid } });
  const actor = req.user?.loginid || 'anonymous';

  if (existing) {
    logger.warn(`⚠️ Register user failed: ${loginid} already exists (attempted by ${actor})`);
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedpwd = await bcrypt.hash(password, 10);
  const user = await Users.create({ 
    loginid: loginid,
    pwdhash: hashedpwd,
    fullname: fullname,
    email: email,
    email_verified: email_verified,
    profile_image: profilePic,
    is_active: is_active,
    phone_number: phone_number,
    phone_verified: phone_verified,
    date_of_birth: date_of_birth,
    userrole: userrole
  });
  // Saving Profile Picture
  if(profilePic){
    logger.info('⚙️ Updated user profilepic');
    //Changing uploaded file to proper name
    const loginid = user.loginid.toString(); 
    const oldFilePath = req.file.path;
    const fileExtention = path.extname(req.file.originalname);
    const newFileName = `profile-${loginid}${fileExtention}`
    const newFilePath = path.join('uploads', newFileName);
    // Rename profile picture file
    logger.debug('Old file name: ', oldFilePath)
    logger.debug('New file name: ', newFilePath)
    fs.renameSync(oldFilePath, newFilePath);
    // Optionally update user record with image path
    user.profile_image = newFileName;
    await user.save();

    logger.info('✅ Updated user profilepic:', user.profile_image);
  }     

  logger.info(`✅ User registered: ${email} by ${actor}`);
  res.json({ message: 'User registered', user });
};

exports.login = async (req, res) => {    
  const { loginid, password } = req.body;
  logger.info(`🔑 Login attempt By loginid: ${loginid}`);
  try {
    if(typeof loginid === 'undefined' || typeof password === 'undefined'){
      logger.info('🚫 Login credentials not provided.');       
      res.status(400).json({ message: 'Login ID or Password not provided' });
    }else{
      const user = await Users.findByPk(loginid);
      logger.debug(`🔍 Retrived User Information From Database => ${JSON.stringify(user, null, 2)}`);   
      if (!user){ 
        logger.info(`⚠️ No User Found With LoginID => ${loginid} !`);
        return res.status(401).json({ message: 'No user found with loginid:'+loginid});        
      }else{ 
        logger.info('🔍 Verifying Password'); 
        if (!(await bcrypt.compare(password, user.pwdhash))) {
          logger.warn(`🔐 Login failed for ${loginid}`);
          logger.debug(`Login Password: ${password}`);
          logger.debug(`Login Password Hashed: ${await bcrypt.hash(password, 10)}`);
          logger.debug(`Stored Hashed Password: ${user.pwdhash}`);
          logger.info('⛔ Invalid Login Credentials');
          return res.status(401).json({ message: 'Invalid credentials' });
        }else{
          logger.info(`🔓 Login successful for => ${loginid}`);
          const token = jwt.sign({ loginid: user.loginid, email: user.email }, process.env.APP_JWT_SECRET, { expiresIn: '1h' });
          logger.debug('🧿 Generated Token Generated');
          // res.json({ token, user });

          // Set cookie for browser-based session
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            secure: process.env.APP_ENV === 'production',
            sameSite: 'Strict'
          });

          // Updating Last Login
          await Users.update({ last_login: new Date() }, { where: { loginid } });
          
          // Return token for API clients
          res.json({ message: 'Login successful', token, user });
        }                 
      } 
    }
  } catch (err) {
    logger.error(`❌ Login error: ${err.message}`);
    logger.trace(`Trace => ${err}`);
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};



