require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const logger = require('../config/logger');

exports.authenticate = async function (req, res, next) {
  logger.debug('🛡️ Auth middleware triggered');
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;
  const method = req.method;
  const url = req.originalUrl;
  const token = authHeader?.split(' ')[1] || cookieToken;  

  if (!token) {
    logger.info(`🔒 Unauthorized request: ${method} ${url} by anonymous`);
    return res.status(403).json({ message: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.APP_JWT_SECRET);
    logger.debug(`✅ Token decoded: ${JSON.stringify(decoded)}`);
    const user = await Users.findOne({ where: { loginid: decoded.loginid, email: decoded.email }});
    if (!user) {
      logger.warn(`⛔ Auth failed: ${method} ${url} - user not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    logger.info(`✅ Authenticated request: ${method} ${url} by ${user.loginid}`);
    next();
  } catch (err) {    
    logger.debug(`🚫 Token verification failed for method => ${method} url => ${url}`);    
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.isAdmin = async function (req, res, next) {
  logger.debug('🔃 Auth role middleware triggered');
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;
  const method = req.method;
  const url = req.originalUrl;
  const token = authHeader?.split(' ')[1] || cookieToken;  

  if (!token) {
    logger.info(`🔒 Unauthorized request: ${method} ${url} by anonymous`);
    return res.status(403).json({ message: 'Token required' });
  }else{
    logger.debug('🔍 Token received:', token);
  }
  
  try {
    const decoded = jwt.verify(token, process.env.APP_JWT_SECRET);
    logger.debug(`✅ Token decoded: ${JSON.stringify(decoded)}`);
    const user = await Users.findOne({ where: { loginid: decoded.loginid, email: decoded.email }});
    if (!user) {
      logger.warn(`⛔ Auth failed: ${method} ${url} - user not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.userrole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (err) {    
    logger.debug(`🚫 Token verification failed for method => ${method} url => ${loginid}`);    
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};