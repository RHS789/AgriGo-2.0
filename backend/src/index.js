require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('../middleware/errorHandler');

// Import routes
const authRoutes = require('../routes/auth');
const resourceRoutes = require('../routes/resources');
const bookingRoutes = require('../routes/bookings');
const chatRoutes = require('../routes/chats');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriGo 2.0 Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriGo 2.0 Backend API',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        profile: 'GET /auth/profile',
        updateProfile: 'PUT /auth/profile'
      },
      resources: {
        create: 'POST /resources (Resource Provider only)',
        getAll: 'GET /resources',
        getById: 'GET /resources/:id',
        update: 'PUT /resources/:id (Resource Provider only)',
        delete: 'DELETE /resources/:id (Resource Provider only)'
      },
      bookings: {
        create: 'POST /bookings (Farmer only)',
        getMyBookings: 'GET /bookings',
        getById: 'GET /bookings/:id',
        updateStatus: 'PUT /bookings/:id/status',
        cancel: 'PUT /bookings/:id/cancel (Farmer only)'
      },
      chats: {
        sendMessage: 'POST /chats',
        getMessages: 'GET /chats/:booking_id',
        markAsRead: 'PUT /chats/:booking_id/read'
      }
    }
  });
});

// Route mounting
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/chats', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  AgriGo 2.0 Backend Server                   ║
║  Running on http://localhost:${PORT}            ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Timestamp: ${new Date().toISOString()}       ║
╚═══════════════════════════════��═══════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
