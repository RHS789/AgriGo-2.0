const supabase = require('../config/supabase');

class User {
  // Create a new user in the database
  static async create(userData) {
    const { email, password, name, role } = userData;

    // Validate role
    if (!['farmer', 'resource_provider'].includes(role)) {
      throw new Error('Invalid role. Must be "farmer" or "resource_provider"');
    }

    try {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // Insert user profile in database
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            name,
            role,
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

  // Login user
  static async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: userData,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile by ID
  static async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  // Verify user token
  static async verifyToken(token) {
    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error) throw error;

      return data.user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
