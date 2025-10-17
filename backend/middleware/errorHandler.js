// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase errors
  if (err.code && err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  // Validation errors
  if (err.validation) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.validation
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
