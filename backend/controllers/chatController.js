const Chat = require('../models/Chat');
const Booking = require('../models/Booking');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { booking_id, message } = req.body;
    const sender_id = req.user.id;
    const sender_name = req.user.name;
    const sender_role = req.user.role;

    // Validate required fields
    if (!booking_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: booking_id, message'
      });
    }

    // Check if booking exists
    const booking = await Booking.getById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is part of the booking
    if (booking.farmer_id !== sender_id && booking.resources.provider_id !== sender_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to chat on this booking'
      });
    }

    const chatMessage = await Chat.sendMessage({
      booking_id,
      sender_id,
      sender_name,
      message,
      sender_role
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

// Get messages for a booking
const getMessages = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const userId = req.user.id;

    // Check if booking exists
    const booking = await Booking.getById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is part of the booking
    if (booking.farmer_id !== userId && booking.resources.provider_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these messages'
      });
    }

    const messages = await Chat.getMessages(booking_id);

    res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { message_ids } = req.body;

    // Validate required fields
    if (!message_ids || !Array.isArray(message_ids)) {
      return res.status(400).json({
        success: false,
        message: 'message_ids must be an array'
      });
    }

    const result = await Chat.markAsRead(booking_id, message_ids);

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
      data: result
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark messages as read'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsRead
};
