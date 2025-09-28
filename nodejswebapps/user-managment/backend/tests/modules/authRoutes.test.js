require('dotenv').config();
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const app = require('../../app'); // Your Express app
const logger = require('../../config/logger');
const { testContext, timeout } = require('../control');

describe('🔐 Authentication Controller - Login', function () {
  this.timeout(timeout || 10000); // Increase timeout for file upload

  before(async function () {
    logger.info('🔐 Auth Test Started ...'); 
    logger.info(`📝 Using Test user context set for loginid => ${testContext.adminUser.loginid} and password=> ${testContext.adminUser.password }`);
  });

  after(async () => {
    logger.debug(`🚀 making API Call [POST] => /auth/login`);    
    // Login and capture tokens
    const adminLogin = await request(app)
      .post('/auth/login')
      .send({ loginid: testContext.adminUser.loginid, password: testContext.adminUser.password });

    logger.info('🔓 Setting authorization context and token for subsequent api calls');
    testContext.adminToken = adminLogin.body.token;
    testContext.adminUser = adminLogin.body.user;
    logger.debug('🧑‍💼 Admin Token:', testContext.adminToken);    
    logger.info('🔓 Authorization context and token set');

    logger.info('🔐 Auth Test Comepled !!!');
  });

  it('🎯 should return 200 and a JWT token for valid credentials', async () => {
    logger.debug(`🚀 making API Call [POST] => /auth/login`);
    const res = await request(app)
      .post('/auth/login')
      .send({ loginid: process.env.APP_DEFAULT_USER, password: process.env.APP_DEFAULT_PWD });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    const decoded = jwt.verify(res.body.token, process.env.APP_JWT_SECRET);
    expect(decoded).to.have.property('loginid');
    expect(decoded).to.have.property('email');
  });

  it('🎯 should return 401 for incorrect password', async () => {
    logger.debug(`🚀 making API Call [POST] => /auth/login`);
    const res = await request(app)
      .post('/auth/login')
      .send({ loginid: process.env.APP_DEFAULT_USER, password: 'WrongPassword' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').that.includes('Invalid credentials');
  });

  it('🎯 should return 401 for non-existent user', async () => {
    logger.debug(`🚀 making API Call [POST] => /auth/login`);
    const res = await request(app)
      .post('/auth/login')
      .send({ loginid: 'nouser@example.com', password: process.env.APP_DEFAULT_PWD });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').that.includes('No user found');
  });

  it('🎯 should return 400 for missing email or password', async () => {
    logger.debug(`🚀 making API Call [POST] => /auth/login`);
    const res = await request(app)
      .post('/auth/login')
      .send({ loginid: process.env.APP_DEFAULT_USER }); // Missing password

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.includes('Login ID or Password not provided');
  });
});
