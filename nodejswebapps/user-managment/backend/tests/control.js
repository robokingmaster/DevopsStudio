module.exports = {
    baseUrl: 'http://localhost:5000/api',
    timeout: 10000,
    testContext: {
        adminUser: null,
        adminToken: null
    },
    tests: [
        { file: './modules/authRoutes.test.js', enabled: true },
        { file: './modules/userRoutes.test.js', enabled: true }        
    ]
};
