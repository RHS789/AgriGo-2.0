# AgriGo 2.0 - Agricultural Resource Sharing Platform

A complete backend solution for connecting farmers and resource providers, enabling resource booking, and facilitating real-time communication.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set environment variables (already configured)
# SUPABASE_URL and SUPABASE_ANON_KEY are set

# Start the server
npm start
```

The backend server will start on `http://localhost:5000`

## 📁 Project Structure

```
agrigo-2.0/
├── backend/
│   ├── config/
│   │   ├── supabase.js          # Supabase client setup
│   │   └── firebase.js          # Firebase config for chat
│   ├── models/
│   │   ├── User.js              # User authentication & profiles
│   │   ├── Resource.js          # Agricultural resource management
│   │   ├── Booking.js           # Resource booking system
│   │   └── Chat.js              # Real-time messaging
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── resources.js         # Resource management endpoints
│   │   ├── bookings.js          # Booking system endpoints
│   │   └── chats.js             # Chat messaging endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── resourceController.js# Resource logic
│   │   ├── bookingController.js # Booking logic
│   │   └── chatController.js    # Chat logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & role-based access
│   │   └── errorHandler.js      # Global error handling
│   ├── utils/
│   │   ├── validation.js        # Input validation helpers
│   │   ├── responseFormatter.js # API response formatting
│   │   └── logger.js            # Logging utility
│   └── src/
│       └── index.js             # Express server entry point
├── .env                         # Environment variables template
├── package.json                 # Dependencies
├── API_REFERENCE.md             # Complete API documentation
├── BACKEND_SETUP.md             # Backend setup guide
├── FRONTEND_INTEGRATION.md      # Frontend integration guide
├── DATABASE_SETUP.md            # Database schema setup
└── README.md                    # This file
```

## 🔑 Key Features

### Authentication & Authorization
- User registration with role selection
- JWT-based authentication
- Role-based access control (Farmer / Resource Provider)
- Secure password handling with bcryptjs

### Resource Management
- Post and manage agricultural resources
- Filter resources by location, type, and provider
- Update and delete resources
- Resource availability status

### Booking System
- Farmers can book resources
- Automatic price calculation
- Booking status management (pending, confirmed, completed, cancelled)
- Booking history and tracking

### Real-Time Chat
- Secure messaging between farmers and resource providers
- Message read status tracking
- Firebase Realtime Database integration
- Per-booking conversation threads

### Role-Based Permissions
```
Farmer:
  ✓ Browse all resources
  ✓ Create bookings
  ✓ View and manage own bookings
  ✓ Chat with resource providers
  ✗ Cannot post resources

Resource Provider:
  ✓ Post and manage resources
  ✓ View bookings for their resources
  ✓ Update booking status
  ✓ Chat with farmers
  ✗ Cannot book resources
```

## 📚 Documentation

- **[API Reference](./API_REFERENCE.md)** - Complete API documentation with examples
- **[Backend Setup](./BACKEND_SETUP.md)** - Backend configuration and database schema
- **[Database Setup](./DATABASE_SETUP.md)** - Supabase table creation guide
- **[Frontend Integration](./FRONTEND_INTEGRATION.md)** - How to integrate with React frontend

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/profile           # Get user profile
PUT    /auth/profile           # Update user profile
```

### Resources
```
POST   /resources              # Create resource (Provider only)
GET    /resources              # Get all resources
GET    /resources/:id          # Get resource by ID
PUT    /resources/:id          # Update resource (Provider only)
DELETE /resources/:id          # Delete resource (Provider only)
```

### Bookings
```
POST   /bookings               # Create booking (Farmer only)
GET    /bookings               # Get user's bookings
GET    /bookings/:id           # Get booking details
PUT    /bookings/:id/status    # Update booking status
PUT    /bookings/:id/cancel    # Cancel booking (Farmer only)
```

### Chat
```
POST   /chats                  # Send message
GET    /chats/:booking_id      # Get messages for booking
PUT    /chats/:booking_id/read # Mark messages as read
```

## 🔐 Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://tkmgunpcdkewbgqxjvxj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Firebase Configuration (for chat)
FIREBASE_PROJECT_ID=agrigo-2-0
FIREBASE_AUTH_DOMAIN=agrigo-2-0.firebaseapp.com
# ... other Firebase config

# Backend Configuration
PORT=5000
NODE_ENV=development
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### API Documentation
Visit: `http://localhost:5000/api/docs`

### Example: Register a User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "SecurePass123",
    "name": "John Farmer",
    "role": "farmer"
  }'
```

### Example: Get All Resources
```bash
curl http://localhost:5000/resources?location=NewYork&type=machinery
```

## 🗄️ Database

The application uses:
- **Supabase PostgreSQL** for users, resources, and bookings
- **Firebase Realtime Database** for chat messages

Database tables:
- `users` - User profiles and authentication
- `resources` - Agricultural resource listings
- `bookings` - Resource reservation records
- `chats` - Real-time messaging (Firebase)

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete schema.

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database & authentication
- **Firebase** - Real-time chat database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin request handling
- **dotenv** - Environment variable management

### Frontend (Integration)
- **React** - UI framework
- **Fetch API** - HTTP requests
- **Context API** - State management
- **Local Storage** - Token persistence

## 📝 API Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

On error:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- SQL injection prevention (via ORM)
- XSS protection headers
- HTTPS-ready configuration
- Row-level security (RLS) in database

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "@supabase/supabase-js": "^2.38.0",
  "firebase": "^10.5.0",
  "firebase-admin": "^12.0.0",
  "jwt-decode": "^4.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "uuid": "^9.0.1"
}
```

## 🚀 Deployment

### Heroku
```bash
heroku create app-name
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_ANON_KEY=...
git push heroku main
```

### AWS
Deploy to EC2 or Lambda using appropriate Node.js runtimes.

### Netlify Functions
Use Netlify serverless functions to run Express backend.

## 📊 Architecture

```
┌─────────────────┐
│  React Frontend │
│  (port 3000)    │
└────────┬────────┘
         │
    HTTP/HTTPS
         │
┌────────▼─────────��──┐
│  Express Backend    │
│  (port 5000)        │
└────┬───────────┬────┘
     │           │
     │           │
┌────▼────┐  ┌──▼─────────────┐
│ Supabase│  │Firebase Realtime│
│ Database│  │Database (Chat)  │
└─────────┘  └─────────────────┘
```

## 🤝 Contributing

1. Follow the existing code structure
2. Keep functions small and focused
3. Add comments for complex logic
4. Use consistent naming conventions
5. Test endpoints before committing

## 📄 License

MIT License

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API_REFERENCE.md for endpoint details
3. Check FRONTEND_INTEGRATION.md for integration help
4. Visit Supabase docs: https://supabase.com/docs
5. Visit Firebase docs: https://firebase.google.com/docs

## 🎯 Next Steps

1. ✅ Backend API setup complete
2. ⏭️ Set up Supabase database tables (see DATABASE_SETUP.md)
3. ⏭️ Configure Firebase for real-time chat
4. ⏭️ Build React frontend with integration (see FRONTEND_INTEGRATION.md)
5. ⏭️ Test all endpoints with Postman or cURL
6. ⏭️ Deploy to production

---

**AgriGo 2.0** - Connecting farmers and resource providers for a sustainable agricultural future.
