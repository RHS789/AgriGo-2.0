// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one uppercase, one lowercase, one number)
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/;
  return passwordRegex.test(password);
};

// Validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validate date range
const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// Validate price (positive number with up to 2 decimal places)
const isValidPrice = (price) => {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price) && parseFloat(price) > 0;
};

// Validate UUID
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Validate role
const isValidRole = (role) => {
  return ['farmer', 'resource_provider'].includes(role);
};

// Validate booking status
const isValidBookingStatus = (status) => {
  return ['pending', 'confirmed', 'completed', 'cancelled'].includes(status);
};

// Validate resource availability
const isValidAvailability = (availability) => {
  return ['available', 'unavailable'].includes(availability);
};

// Sanitize string (remove special characters)
const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};

// Validate all required fields
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidDate,
  isValidDateRange,
  isValidPrice,
  isValidUUID,
  isValidRole,
  isValidBookingStatus,
  isValidAvailability,
  sanitizeString,
  validateRequiredFields
};
