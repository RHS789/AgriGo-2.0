const User = require('../models/User');

// Verify JWT token and attach user to request
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const user = await User.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Get user profile with role
    const userProfile = await User.getProfile(user.id);

    req.user = {
      id: user.id,
      email: user.email,
      ...userProfile
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: error.message
    });
  }
};

// Check if user is a farmer
const requireFarmer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      success: false,
      message: 'This action requires a farmer account'
    });
  }

  next();
};

// Check if user is a resource provider
const requireResourceProvider = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  if (req.user.role !== 'resource_provider') {
    return res.status(403).json({
      success: false,
      message: 'This action requires a resource provider account'
    });
  }

  next();
};

module.exports = {
  verifyToken,
  requireFarmer,
  requireResourceProvider
};
