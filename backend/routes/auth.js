const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile (requires authentication)
router.get('/profile', verifyToken, authController.getProfile);

// Update user profile (requires authentication)
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
