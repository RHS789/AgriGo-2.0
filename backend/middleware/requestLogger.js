const logger = require('../utils/logger');

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Store request ID for later use
  req.id = requestId;

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      url: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error(`Server Error: ${req.method} ${req.path}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`Client Error: ${req.method} ${req.path}`, logData);
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      logger.info(`Success: ${req.method} ${req.path}`, logData);
    } else {
      logger.info(`Response: ${req.method} ${req.path}`, logData);
    }
  });

  next();
};

// Generate unique request ID
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

module.exports = requestLogger;
