const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const { register, login, logout } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', authenticate, isAdmin, upload.single('profilepic'), register); // ✅ Protected
router.post('/logout', logout);

module.exports = router;
