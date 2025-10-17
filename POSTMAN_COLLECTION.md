# Postman Collection Guide

This guide helps you test the AgriGo 2.0 API using Postman.

## Setup

### 1. Create a New Postman Collection

1. Open Postman
2. Click **New** → **Collection**
3. Name it "AgriGo 2.0 API"

### 2. Create Environment Variables

1. Click **Environments** (left sidebar)
2. Click **Create New**
3. Name it "AgriGo Dev"
4. Add these variables:

```
Variable Name          | Initial Value              | Current Value
─────────────────────────────────────────────────────────────────────
base_url               | http://localhost:5000      | http://localhost:5000
auth_token             | (leave empty)              | (leave empty)
farmer_token           | (leave empty)              | (leave empty)
provider_token         | (leave empty)              | (leave empty)
resource_id            | (leave empty)              | (leave empty)
booking_id             | (leave empty)              | (leave empty)
```

## 1. Authentication Endpoints

### 1.1 Register Farmer

**Request:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123",
  "name": "John Farmer",
  "role": "farmer"
}
```

**Tests (Add to Tests tab):**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("farmer_id", jsonData.data.id);
    pm.environment.set("farmer_email", jsonData.data.email);
}
```

---

### 1.2 Register Resource Provider

**Request:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "email": "provider@example.com",
  "password": "SecurePass123",
  "name": "Jane Provider",
  "role": "resource_provider"
}
```

**Tests:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("provider_id", jsonData.data.id);
}
```

---

### 1.3 Login Farmer

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123"
}
```

**Tests:**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("farmer_token", jsonData.data.token);
    pm.environment.set("farmer_user", JSON.stringify(jsonData.data.user));
}
```

---

### 1.4 Login Provider

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "provider@example.com",
  "password": "SecurePass123"
}
```

**Tests:**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("provider_token", jsonData.data.token);
}
```

---

### 1.5 Get Farmer Profile

**Request:**
```
GET {{base_url}}/auth/profile
Authorization: Bearer {{farmer_token}}
```

---

### 1.6 Update Farmer Profile

**Request:**
```
PUT {{base_url}}/auth/profile
Authorization: Bearer {{farmer_token}}
Content-Type: application/json

{
  "name": "John Smith Updated",
  "email": "newemail@example.com"
}
```

---

## 2. Resource Endpoints

### 2.1 Create Resource (Provider Only)

**Request:**
```
POST {{base_url}}/resources
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "name": "Tractor Model XYZ",
  "type": "machinery",
  "description": "Heavy-duty tractor for plowing",
  "availability": "available",
  "price": 50.00,
  "location": "New York, USA"
}
```

**Tests:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("resource_id", jsonData.data.id);
}
```

---

### 2.2 Get All Resources

**Request:**
```
GET {{base_url}}/resources
```

**With Filters:**
```
GET {{base_url}}/resources?location=New York&type=machinery
```

---

### 2.3 Get Resource by ID

**Request:**
```
GET {{base_url}}/resources/{{resource_id}}
```

---

### 2.4 Update Resource (Provider Only)

**Request:**
```
PUT {{base_url}}/resources/{{resource_id}}
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "price": 60.00,
  "availability": "unavailable"
}
```

---

### 2.5 Delete Resource (Provider Only)

**Request:**
```
DELETE {{base_url}}/resources/{{resource_id}}
Authorization: Bearer {{provider_token}}
```

---

## 3. Booking Endpoints

### 3.1 Create Booking (Farmer Only)

**Request:**
```
POST {{base_url}}/bookings
Authorization: Bearer {{farmer_token}}
Content-Type: application/json

{
  "resource_id": "{{resource_id}}",
  "start_date": "2025-11-01",
  "end_date": "2025-11-05",
  "quantity": 2,
  "notes": "Needed for crop plowing"
}
```

**Tests:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("booking_id", jsonData.data.id);
}
```

---

### 3.2 Get My Bookings

**Request:**
```
GET {{base_url}}/bookings
Authorization: Bearer {{farmer_token}}
```

---

### 3.3 Get Booking by ID

**Request:**
```
GET {{base_url}}/bookings/{{booking_id}}
Authorization: Bearer {{farmer_token}}
```

---

### 3.4 Update Booking Status

**Request:**
```
PUT {{base_url}}/bookings/{{booking_id}}/status
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

---

### 3.5 Cancel Booking (Farmer Only)

**Request:**
```
PUT {{base_url}}/bookings/{{booking_id}}/cancel
Authorization: Bearer {{farmer_token}}
```

---

## 4. Chat Endpoints

### 4.1 Send Message

**Request:**
```
POST {{base_url}}/chats
Authorization: Bearer {{farmer_token}}
Content-Type: application/json

{
  "booking_id": "{{booking_id}}",
  "message": "When can you deliver the tractor?"
}
```

---

### 4.2 Get Messages for Booking

**Request:**
```
GET {{base_url}}/chats/{{booking_id}}
Authorization: Bearer {{farmer_token}}
```

---

### 4.3 Mark Messages as Read

**Request:**
```
PUT {{base_url}}/chats/{{booking_id}}/read
Authorization: Bearer {{farmer_token}}
Content-Type: application/json

{
  "message_ids": ["message-uuid-1", "message-uuid-2"]
}
```

---

## Complete Test Flow

Follow this sequence to test the entire API:

### Step 1: Authentication
1. Register Farmer
2. Register Provider
3. Login Farmer (save token)
4. Login Provider (save token)

### Step 2: Resource Management
1. Create Resource (as Provider)
2. Get All Resources
3. Get Resource by ID
4. Update Resource (as Provider)

### Step 3: Booking
1. Create Booking (as Farmer)
2. Get My Bookings (as Farmer)
3. Get Booking by ID

### Step 4: Booking Status
1. Update Booking Status (as Provider - confirm)
2. Get Booking (verify status changed)

### Step 5: Chat
1. Send Message (as Farmer)
2. Send Message (as Provider)
3. Get Messages (as Farmer)
4. Mark as Read (as Farmer)

---

## Import Collection from JSON

If you have a collection JSON file, you can import it:

1. Click **Import** in Postman
2. Select the JSON file
3. Select your collection
4. Click **Import**

---

## Common Issues

### "Authorization header missing"
- Make sure you're setting the `Authorization` header
- Format: `Bearer <token>`

### "Invalid token"
- Login again to get a fresh token
- Tokens may expire after some time

### "Permission denied / Forbidden"
- Make sure you're using the correct role
- Farmers cannot create resources
- Providers cannot create bookings

### "Resource not found"
- Make sure the resource ID exists
- Create a resource first before booking

---

## Example Response Objects

### Successful Response (201 Created)
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tractor Model XYZ",
    "type": "machinery",
    "price": 50.00,
    "location": "New York, USA",
    "provider_id": "660e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-10-17T15:30:00Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Missing required fields: email, password, name, role"
}
```

---

## Tips for Testing

1. **Use Variables**: Always use `{{variable_name}}` for dynamic values
2. **Save Tokens**: After login, automatically save the token to an environment variable
3. **Test Assertions**: Use the Tests tab to validate responses
4. **Create Folders**: Organize requests into folders (Auth, Resources, Bookings, Chats)
5. **Use Descriptions**: Add descriptions to each request for clarity

---

## Exporting Tests Results

1. Click **Run Collection** (play icon)
2. Configure run settings
3. Click **Run AgriGo 2.0 API**
4. View results and export if needed

---

For more help, refer to [Postman Documentation](https://learning.postman.com/)
