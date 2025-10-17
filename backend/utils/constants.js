// Role constants
const ROLES = {
  FARMER: 'farmer',
  RESOURCE_PROVIDER: 'resource_provider'
};

// Booking status constants
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Resource availability constants
const RESOURCE_AVAILABILITY = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
};

// Resource types
const RESOURCE_TYPES = {
  MACHINERY: 'machinery',
  EQUIPMENT: 'equipment',
  TOOLS: 'tools',
  SEEDS: 'seeds',
  FERTILIZER: 'fertilizer',
  PESTICIDE: 'pesticide',
  STORAGE: 'storage',
  TRANSPORT: 'transport',
  LABOR: 'labor',
  CONSULTING: 'consulting'
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  INVALID_TOKEN: 'Invalid or expired token',
  MISSING_TOKEN: 'Missing authentication token',
  INVALID_ROLE: 'Invalid user role',
  INVALID_STATUS: 'Invalid status',
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_ERROR: 'Internal server error',
  ALREADY_EXISTS: 'Resource already exists',
  OPERATION_NOT_ALLOWED: 'Operation not allowed'
};

// Success messages
const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  OPERATION_SUCCESS: 'Operation completed successfully'
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Validation rules
const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_PRICE: 999999.99,
  MIN_PRICE: 0.01,
  MAX_QUANTITY: 99999.99,
  MIN_QUANTITY: 0.01
};

// Cache durations (in seconds)
const CACHE_DURATION = {
  RESOURCES: 300,        // 5 minutes
  BOOKINGS: 600,         // 10 minutes
  USER_PROFILE: 1800,    // 30 minutes
  SHORT: 60,             // 1 minute
  MEDIUM: 300,           // 5 minutes
  LONG: 3600             // 1 hour
};

// Rate limiting
const RATE_LIMITS = {
  AUTH_ATTEMPTS: 5,              // Per 15 minutes
  API_REQUESTS: 100,             // Per 15 minutes
  FILE_UPLOAD_SIZE: 5242880      // 5MB in bytes
};

// JWT configuration
const JWT_CONFIG = {
  ALGORITHM: 'HS256',
  EXPIRATION: '24h',
  REFRESH_EXPIRATION: '7d'
};

// CORS configuration
const CORS_CONFIG = {
  ALLOWED_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  CREDENTIALS: true,
  MAX_AGE: 86400
};

module.exports = {
  ROLES,
  BOOKING_STATUS,
  RESOURCE_AVAILABILITY,
  RESOURCE_TYPES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  VALIDATION_RULES,
  CACHE_DURATION,
  RATE_LIMITS,
  JWT_CONFIG,
  CORS_CONFIG
};
