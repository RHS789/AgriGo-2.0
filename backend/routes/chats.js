const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/auth');

// Send a message (requires authentication)
router.post('/', verifyToken, chatController.sendMessage);

// Get messages for a booking (requires authentication)
router.get('/:booking_id', verifyToken, chatController.getMessages);

// Mark messages as read (requires authentication)
router.put('/:booking_id/read', verifyToken, chatController.markMessagesAsRead);

module.exports = router;
