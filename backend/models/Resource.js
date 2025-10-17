const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

class Resource {
  // Create a new resource
  static async create(resourceData) {
    const {
      name,
      type,
      description,
      availability,
      price,
      location,
      provider_id
    } = resourceData;

    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([
          {
            id: uuidv4(),
            name,
            type,
            description,
            availability,
            price,
            location,
            provider_id,
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

  // Get all resources with optional filters
  static async getAll(filters = {}) {
    try {
      let query = supabase.from('resources').select('*');

      // Apply filters
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.provider_id) {
        query = query.eq('provider_id', filters.provider_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get resource by ID
  static async getById(resourceId) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update resource
  static async update(resourceId, updates) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', resourceId)
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete resource
  static async delete(resourceId) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId)
        .select();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check if resource belongs to provider
  static async belongsToProvider(resourceId, providerId) {
    try {
      const resource = await this.getById(resourceId);
      return resource && resource.provider_id === providerId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Resource;
