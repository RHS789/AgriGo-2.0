const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

const supabase = require('../config/supabase');

class Booking {
  // Create a new booking
  static async create(bookingData) {
    const {
      farmer_id,
      resource_id,
      start_date,
      end_date,
      quantity,
      total_price,
      notes
    } = bookingData;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            id: uuidv4(),
            farmer_id,
            resource_id,
            start_date,
            end_date,
            quantity,
            total_price,
            notes,
            status: 'pending',
            created_at: new Date()
          }
        ])
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings for a user
  static async getByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          resources:resource_id(*)
        `)
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  static async getById(bookingId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          resources:resource_id(*)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  static async updateStatus(bookingId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date()
        })
        .eq('id', bookingId)
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings for a resource provider
  static async getByProviderId(providerId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          resources:resource_id(*)
        `)
        .eq('resources.provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check if booking belongs to farmer
  static async belongsToFarmer(bookingId, farmerId) {
    try {
      const booking = await this.getById(bookingId);
      return booking && booking.farmer_id === farmerId;
    } catch (error) {
      throw error;
    }
  }

  // Delete booking
  static async delete(bookingId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .select();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;
