const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Users Routes
const { getUsers, getUserByID, updateUserByID, deleteUserByID } = require('../controllers/apiControllerUsers');
router.get('/users', authenticate, getUsers);
router.get('/users/:loginid', authenticate, getUserByID);

// router.put('/users/:loginid', authenticate, updateUserByID);
router.put('/users/:loginid', authenticate, isAdmin, upload.single('profile_image'), updateUserByID);
router.delete('/users/:loginid', authenticate, isAdmin, deleteUserByID);

// router.post('/users', authMiddleware, createUser);


module.exports = router;