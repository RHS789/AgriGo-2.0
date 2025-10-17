// Success response formatter
const successResponse = (res, statusCode, message, data = null, count = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(count !== null && { count })
  };
  
  return res.status(statusCode).json(response);
};

// Error response formatter
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

// Pagination helper
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

// Sort helper
const getSortParams = (query) => {
  const sortBy = query.sortBy || 'created_at';
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder) ? query.sortOrder : 'desc';
  
  return { sortBy, sortOrder };
};

module.exports = {
  successResponse,
  errorResponse,
  getPaginationParams,
  getSortParams
};
