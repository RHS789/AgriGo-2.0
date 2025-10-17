# AgriGo 2.0 Backend Setup Guide

## Prerequisites

- Node.js v16+ 
- Supabase account (connected)
- Firebase project (optional, for real-time chat)

## Installation

```bash
npm install
```

## Environment Variables

The following variables are already set in the environment:

```
SUPABASE_URL=https://tkmgunpcdkewbgqxjvxj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWd1bnBjZGtld2JncXhqdnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5MjksImV4cCI6MjA3NTc4NzkyOX0.YTAeE_hcOwmhuFLCsBDp3re_hdFmrMpgG16dvC51OQQ
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'resource_provider')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Resources Table
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  availability VARCHAR(50) DEFAULT 'available',
  price DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Running the Server

```bash
npm start
```

Server will run on `http://localhost:5000`

Visit `http://localhost:5000/api/docs` for full API documentation.

## Project Structure

```
backend/
├── config/
│   ├── supabase.js       # Supabase client initialization
│   └── firebase.js       # Firebase config for chat
├── models/
│   ├── User.js           # User model
│   ├── Resource.js       # Resource model
│   ├── Booking.js        # Booking model
│   └── Chat.js           # Chat model
├── routes/
│   ├── auth.js           # Auth routes
│   ├── resources.js      # Resource routes
│   ├── bookings.js       # Booking routes
│   └── chats.js          # Chat routes
├── controllers/
│   ├── authController.js       # Auth logic
│   ├── resourceController.js   # Resource logic
│   ├── bookingController.js    # Booking logic
│   └── chatController.js       # Chat logic
├── middleware/
│   ├── auth.js           # Authentication & authorization
│   └── errorHandler.js   # Global error handling
└── src/
    └── index.js          # Express server entry point
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (authenticated)
- `PUT /auth/profile` - Update user profile (authenticated)

### Resources
- `POST /resources` - Create resource (Resource Provider only)
- `GET /resources` - Get all resources (public)
- `GET /resources/:id` - Get resource by ID (public)
- `PUT /resources/:id` - Update resource (Resource Provider only)
- `DELETE /resources/:id` - Delete resource (Resource Provider only)

### Bookings
- `POST /bookings` - Create booking (Farmer only)
- `GET /bookings` - Get user's bookings (authenticated)
- `GET /bookings/:id` - Get booking by ID (authenticated)
- `PUT /bookings/:id/status` - Update booking status (authenticated)
- `PUT /bookings/:id/cancel` - Cancel booking (Farmer only)

### Chat
- `POST /chats` - Send message (authenticated)
- `GET /chats/:booking_id` - Get messages (authenticated)
- `PUT /chats/:booking_id/read` - Mark messages as read (authenticated)

## Role-Based Access Control

### Farmer
- Can book resources
- Can view and cancel their bookings
- Can chat with resource providers
- Cannot post resources

### Resource Provider
- Can post and manage resources
- Can view bookings for their resources
- Can chat with farmers
- Cannot book resources

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Descriptive message",
  "data": {}
}
```

## Error Handling

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Health Check

```bash
curl http://localhost:5000/health
```

## Notes

- All authenticated requests require `Authorization: Bearer <token>` header
- Chat messages are stored in Firebase Realtime Database for real-time updates
- Resource and booking data are stored in Supabase PostgreSQL
