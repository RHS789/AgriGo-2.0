const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, requireFarmer } = require('../middleware/auth');

// Create a new booking (Farmer only)
router.post('/', verifyToken, requireFarmer, bookingController.createBooking);

// Get my bookings (requires authentication)
router.get('/', verifyToken, bookingController.getMyBookings);

// Get booking by ID (requires authentication)
router.get('/:id', verifyToken, bookingController.getBookingById);

// Update booking status (requires authentication)
router.put('/:id/status', verifyToken, bookingController.updateBookingStatus);

// Cancel booking (Farmer only)
router.put('/:id/cancel', verifyToken, requireFarmer, bookingController.cancelBooking);

module.exports = router;
