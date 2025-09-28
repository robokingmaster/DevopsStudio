
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../app'); // Your Express app
const logger = require('../../logger');
const path = require('path');
const fs = require('fs');
const { testContext, timeout } = require('../control');

describe('🧑‍💼 User Routes', function () {
  this.timeout(timeout); // Increase timeout for file upload

  before(() => {
    logger.info('🧑‍💼 User Test Started ...');
    logger.info(`📝 Using Test user context set for loginid => ${testContext.adminUser.loginid} and password=> ${testContext.adminUser.password }`);
  });

  after(() => {
    logger.info('🔐 User Test Comepled !!!');
  });

  it('🎯 should get all users (admin only)', async () => {
    logger.debug(`🚀 making API Call [GET] => /api/users`);
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${testContext.adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('🎯 should get a specific user by ID (authenticated)', async () => {
    logger.debug(`🚀 making API Call [GET] => /api/users/${testContext.adminUser.loginid}`);
    const res = await request(app)
      .get(`/api/users/${testContext.adminUser.loginid}`)
      .set('Authorization', `Bearer ${testContext.adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('email', testContext.adminUser.email);
  });

  it('🎯 should update a user (admin only)', async () => {
    logger.debug(`🚀 making API Call [PUT] => /api/users/${testContext.adminUser.loginid}`);
    const imagePath = path.join(__dirname, '..', 'fixtures', 'testProfileImage.jpg');
    logger.debug('📷 Image exists :', fs.existsSync(imagePath));

    const res = await request(app)
      .put(`/api/users/${testContext.adminUser.loginid}`)
      .set('Authorization', `Bearer ${testContext.adminToken}`)
      .field('name', 'Updated User Name')
      .field('date_of_birth', '2015-10-02')
      .field('phone_number', '3456782561')
      .attach('profile_image', imagePath);      
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'User information updated successfully');
  });

  // it('🎯 should delete a user (admin only)', async () => {
  //   logger.debug(`making API Call [DELETE] => /api/users/${testContext.adminUser.id}`);
  //   const res = await request(app)
  //     .delete(`/api/users/${testContext.adminUser.id}`)
  //     .set('Authorization', `Bearer ${testContext.adminToken}`);

  //   expect(res.status).to.equal(200);
  //   expect(res.body).to.have.property('message');
  // });
});
