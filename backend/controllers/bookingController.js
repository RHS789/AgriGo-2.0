const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

// Create a new booking (Farmer only)
const createBooking = async (req, res) => {
  try {
    const { resource_id, start_date, end_date, quantity, notes } = req.body;
    const farmer_id = req.user.id;

    // Validate required fields
    if (!resource_id || !start_date || !end_date || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: resource_id, start_date, end_date, quantity'
      });
    }

    // Check if resource exists
    const resource = await Resource.getById(resource_id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Calculate total price
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const total_price = resource.price * quantity * days;

    const booking = await Booking.create({
      farmer_id,
      resource_id,
      start_date,
      end_date,
      quantity,
      total_price,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// Get bookings for current user
const getMyBookings = async (req, res) => {
  try {
    const farmer_id = req.user.id;

    const bookings = await Booking.getByUserId(farmer_id);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.getById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking'
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Check if booking exists
    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is either the farmer or the resource provider
    if (booking.farmer_id !== userId && booking.resources.provider_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this booking'
      });
    }

    const updatedBooking = await Booking.updateStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update booking'
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer_id = req.user.id;

    // Check if booking exists and belongs to farmer
    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.farmer_id !== farmer_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    const cancelledBooking = await Booking.updateStatus(id, 'cancelled');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};
