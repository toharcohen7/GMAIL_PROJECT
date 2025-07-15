# Authentication API

This document describes the authentication endpoints and mechanisms used by the Gmail Project API.

## Overview

The Gmail Project uses JWT (JSON Web Tokens) for authentication. The authentication flow consists of:

1. User registration
2. User login to obtain a JWT token
3. Using the token for authenticated requests

## Endpoints

### Register a New User

**Endpoint:** `POST api/users`

**Description:** Creates a new user account.

**Request Body:**
```json
{
  "userName": "johndoe",
  "password": "securePassword123!",
  "confirmPassword": "securePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "birthDate": "1990-01-01",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." 
}
```

**Response:**
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "userName": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "birthDate": "1990-01-01"
}
```

**Status Codes:**
- `201 Created`: User successfully registered
- `400 Bad Request`: Invalid input data or password doesn't meet requirements
- `409 Conflict`: Username already exists

### Login

**Endpoint:** `POST api/tokens`

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "userName": "johndoe",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200 OK`: Successful login
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid username or password

### Get Current User

**Endpoint:** `GET api/users/me`

**Description:** Retrieves the current user's information based on the JWT token.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "userName": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "birthDate": "1990-01-01",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Status Codes:**
- `200 OK`: Successful request
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token validation failed
- `404 Not Found`: User not found

## Authentication in API Requests

For all authenticated endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The server also requires the user ID to be passed in a custom header:

```
user-id: <userId>
```

The user ID can be extracted from the JWT token payload.

## Error Responses

API endpoints may return the following error responses:

```json
{
  "error": "Error message description"
}
```

Common errors:
- `Missing or invalid user-id header`
- `User not found`
- `Invalid user name or password`
- `userName already exists`

## Password Requirements

Passwords must meet the following requirements:
- At least 6 characters long
- Contains at least one uppercase letter
- Contains at least one number
- Contains at least one special character

## Security Implementation

- JWT tokens do not expire in the current implementation
- Passwords are stored directly in the database
- User must log out manually by removing the token from local storage
- Session persistence is handled through localStorage in the