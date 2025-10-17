# AgriGo 2.0 API Reference

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Register a new user (Farmer or Resource Provider)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "farmer"  // or "resource_provider"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "farmer"
  }
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "farmer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh-token-here"
  }
}
```

---

### 3. Get User Profile

**Endpoint:** `GET /auth/profile`

**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "farmer",
    "created_at": "2025-10-17T15:00:00Z"
  }
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /auth/profile`

**Description:** Update authenticated user's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-here",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "role": "farmer"
  }
}
```

---

## Resource Endpoints

### 1. Create Resource

**Endpoint:** `POST /resources`

**Description:** Create a new resource (Resource Provider only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Tractor Model XYZ",
  "type": "machinery",
  "description": "Heavy-duty tractor for plowing",
  "availability": "available",
  "price": 50.00,
  "location": "New York, USA"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Tractor Model XYZ",
    "type": "machinery",
    "description": "Heavy-duty tractor for plowing",
    "availability": "available",
    "price": 50.00,
    "location": "New York, USA",
    "provider_id": "provider-uuid",
    "created_at": "2025-10-17T15:00:00Z"
  }
}
```

---

### 2. Get All Resources

**Endpoint:** `GET /resources`

**Description:** Get all resources with optional filters (public endpoint)

**Query Parameters:**
```
?location=New York&type=machinery&provider_id=uuid
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "name": "Tractor Model XYZ",
      "type": "machinery",
      "price": 50.00,
      "location": "New York, USA",
      "provider_id": "provider-uuid",
      "created_at": "2025-10-17T15:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Resource by ID

**Endpoint:** `GET /resources/:id`

**Description:** Get a specific resource (public endpoint)

**Response (200):**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "Tractor Model XYZ",
    "type": "machinery",
    "description": "Heavy-duty tractor for plowing",
    "availability": "available",
    "price": 50.00,
    "location": "New York, USA",
    "provider_id": "provider-uuid",
    "created_at": "2025-10-17T15:00:00Z"
  }
}
```

---

### 4. Update Resource

**Endpoint:** `PUT /resources/:id`

**Description:** Update resource (Resource Provider only, owner)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 60.00,
  "availability": "unavailable"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "Tractor Model XYZ",
    "price": 60.00,
    "availability": "unavailable",
    "updated_at": "2025-10-17T15:10:00Z"
  }
}
```

---

### 5. Delete Resource

**Endpoint:** `DELETE /resources/:id`

**Description:** Delete resource (Resource Provider only, owner)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": {
    "id": "uuid-here"
  }
}
```

---

## Booking Endpoints

### 1. Create Booking

**Endpoint:** `POST /bookings`

**Description:** Create a booking for a resource (Farmer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "resource_id": "uuid-here",
  "start_date": "2025-11-01",
  "end_date": "2025-11-05",
  "quantity": 2,
  "notes": "Needed for crop plowing"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-uuid",
    "farmer_id": "farmer-uuid",
    "resource_id": "resource-uuid",
    "start_date": "2025-11-01",
    "end_date": "2025-11-05",
    "quantity": 2,
    "total_price": 600.00,
    "notes": "Needed for crop plowing",
    "status": "pending",
    "created_at": "2025-10-17T15:00:00Z"
  }
}
```

---

### 2. Get My Bookings

**Endpoint:** `GET /bookings`

**Description:** Get all bookings for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": "booking-uuid",
      "farmer_id": "farmer-uuid",
      "resource_id": "resource-uuid",
      "status": "pending",
      "total_price": 600.00,
      "created_at": "2025-10-17T15:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Booking by ID

**Endpoint:** `GET /bookings/:id`

**Description:** Get specific booking details

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": "booking-uuid",
    "farmer_id": "farmer-uuid",
    "resource_id": "resource-uuid",
    "start_date": "2025-11-01",
    "end_date": "2025-11-05",
    "quantity": 2,
    "total_price": 600.00,
    "status": "pending",
    "resources": {
      "id": "resource-uuid",
      "name": "Tractor Model XYZ",
      "provider_id": "provider-uuid"
    }
  }
}
```

---

### 4. Update Booking Status

**Endpoint:** `PUT /bookings/:id/status`

**Description:** Update booking status (Farmer or Resource Provider)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Statuses:** `pending`, `confirmed`, `completed`, `cancelled`

**Response (200):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "id": "booking-uuid",
    "status": "confirmed",
    "updated_at": "2025-10-17T15:15:00Z"
  }
}
```

---

### 5. Cancel Booking

**Endpoint:** `PUT /bookings/:id/cancel`

**Description:** Cancel a booking (Farmer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "booking-uuid",
    "status": "cancelled",
    "updated_at": "2025-10-17T15:20:00Z"
  }
}
```

---

## Chat Endpoints

### 1. Send Message

**Endpoint:** `POST /chats`

**Description:** Send a message in a booking chat (authenticated user)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "booking_id": "booking-uuid",
  "message": "When can you deliver the tractor?"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "message-uuid",
    "booking_id": "booking-uuid",
    "sender_id": "user-uuid",
    "sender_name": "John Doe",
    "sender_role": "farmer",
    "message": "When can you deliver the tractor?",
    "timestamp": "2025-10-17T15:30:00Z",
    "read": false
  }
}
```

---

### 2. Get Messages for Booking

**Endpoint:** `GET /chats/:booking_id`

**Description:** Fetch all messages for a booking (authenticated user)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": "message-uuid-1",
      "booking_id": "booking-uuid",
      "sender_id": "farmer-uuid",
      "sender_name": "John Doe",
      "sender_role": "farmer",
      "message": "When can you deliver the tractor?",
      "timestamp": "2025-10-17T15:30:00Z",
      "read": false
    },
    {
      "id": "message-uuid-2",
      "booking_id": "booking-uuid",
      "sender_id": "provider-uuid",
      "sender_name": "Jane Smith",
      "sender_role": "resource_provider",
      "message": "Available on November 1st",
      "timestamp": "2025-10-17T15:35:00Z",
      "read": false
    }
  ],
  "count": 2
}
```

---

### 3. Mark Messages as Read

**Endpoint:** `PUT /chats/:booking_id/read`

**Description:** Mark messages as read

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message_ids": ["message-uuid-1", "message-uuid-2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Messages marked as read",
  "data": {
    "success": true
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: email, password, name, role"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Missing or invalid authorization header"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "This action requires a resource provider account"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

- `200` - OK (successful GET, PUT requests)
- `201` - Created (successful POST requests)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

No rate limiting is currently implemented. Production deployments should implement rate limiting.

---

## CORS

The backend accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

---

## Testing the API

You can test the API using tools like:
- **cURL**
- **Postman**
- **Insomnia**
- **Thunder Client (VS Code)**

### Example cURL Request:

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe",
    "role": "farmer"
  }'
```

---

## Documentation Endpoint

Visit `http://localhost:5000/api/docs` for a JSON summary of all endpoints.
