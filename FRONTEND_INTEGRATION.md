# Frontend Integration Guide

This guide explains how to integrate your React frontend with the AgriGo 2.0 backend.

## Backend URL

The backend is running at:
```
http://localhost:5000
```

Set this in your frontend environment variables:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Authentication Flow

### 1. Register User

```javascript
const register = async (userData) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role // 'farmer' or 'resource_provider'
    })
  });

  const data = await response.json();
  return data;
};
```

### 2. Login User

```javascript
const login = async (credentials) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  });

  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage or sessionStorage
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
  
  return data;
};
```

### 3. Get Current User Profile

```javascript
const getProfile = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
};
```

## API Request Helper

Create a utility function to handle authenticated requests:

```javascript
// src/utils/api.js

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  // Handle 401 - token expired
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return data;
};

// Usage:
// const result = await apiCall('/resources', { method: 'GET' });
// const resource = await apiCall('/resources', {
//   method: 'POST',
//   body: JSON.stringify(resourceData)
// });
```

## Resource Management (Resource Provider)

### Create Resource

```javascript
const createResource = async (resourceData) => {
  return apiCall('/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData)
  });
};

// Usage:
// createResource({
//   name: 'Tractor',
//   type: 'machinery',
//   description: 'Heavy-duty tractor',
//   availability: 'available',
//   price: 50.00,
//   location: 'New York, USA'
// });
```

### Get All Resources

```javascript
const getResources = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.provider_id) queryParams.append('provider_id', filters.provider_id);
  
  const url = `/resources${queryParams.toString() ? '?' + queryParams : ''}`;
  
  return apiCall(url, { method: 'GET' });
};

// Usage:
// getResources({ location: 'New York', type: 'machinery' });
```

### Update Resource

```javascript
const updateResource = async (resourceId, updates) => {
  return apiCall(`/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

// Usage:
// updateResource('resource-uuid', { price: 60.00 });
```

### Delete Resource

```javascript
const deleteResource = async (resourceId) => {
  return apiCall(`/resources/${resourceId}`, {
    method: 'DELETE'
  });
};
```

## Booking Management (Farmer)

### Create Booking

```javascript
const createBooking = async (bookingData) => {
  return apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      resource_id: bookingData.resourceId,
      start_date: bookingData.startDate, // 'YYYY-MM-DD'
      end_date: bookingData.endDate,
      quantity: bookingData.quantity,
      notes: bookingData.notes
    })
  });
};

// Usage:
// createBooking({
//   resourceId: 'resource-uuid',
//   startDate: '2025-11-01',
//   endDate: '2025-11-05',
//   quantity: 2,
//   notes: 'For crop plowing'
// });
```

### Get My Bookings

```javascript
const getMyBookings = async () => {
  return apiCall('/bookings', { method: 'GET' });
};
```

### Get Booking Details

```javascript
const getBooking = async (bookingId) => {
  return apiCall(`/bookings/${bookingId}`, { method: 'GET' });
};
```

### Update Booking Status

```javascript
const updateBookingStatus = async (bookingId, status) => {
  return apiCall(`/bookings/${bookingId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
};

// Valid statuses: 'pending', 'confirmed', 'completed', 'cancelled'
```

### Cancel Booking

```javascript
const cancelBooking = async (bookingId) => {
  return apiCall(`/bookings/${bookingId}/cancel`, {
    method: 'PUT'
  });
};
```

## Chat System

### Send Message

```javascript
const sendMessage = async (bookingId, message) => {
  return apiCall('/chats', {
    method: 'POST',
    body: JSON.stringify({
      booking_id: bookingId,
      message: message
    })
  });
};

// Usage:
// sendMessage('booking-uuid', 'When can you deliver?');
```

### Get Messages for Booking

```javascript
const getMessages = async (bookingId) => {
  return apiCall(`/chats/${bookingId}`, { method: 'GET' });
};
```

### Mark Messages as Read

```javascript
const markMessagesAsRead = async (bookingId, messageIds) => {
  return apiCall(`/chats/${bookingId}/read`, {
    method: 'PUT',
    body: JSON.stringify({ message_ids: messageIds })
  });
};
```

## React Hooks Example

```javascript
// src/hooks/useApi.js

import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(endpoint, options);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

// Usage in component:
// const { execute, loading, error } = useApi();
// const resources = await execute('/resources');
```

## Context API for Auth State

```javascript
// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success) {
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage in component:
// const { user, token } = useContext(AuthContext);
```

## Error Handling

All API responses follow this format:

```javascript
{
  success: true|false,
  message: "Description of response",
  data: {} // Only present on success
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production.

## CORS

The backend accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173`

For production, update the CORS configuration in `backend/src/index.js`.

## Production Deployment

When deploying to production:

1. Update `REACT_APP_BACKEND_URL` to your production backend URL
2. Update CORS origins in `backend/src/index.js`
3. Implement proper token refresh mechanism
4. Use HTTPS for all requests
5. Implement request/response logging
6. Add rate limiting
7. Implement caching strategies
