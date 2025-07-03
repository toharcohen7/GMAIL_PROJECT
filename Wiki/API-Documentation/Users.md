# Users API

This document describes the endpoints for user management in the Gmail Project API.

## Authentication

All user endpoints, except for user creation, require authentication using a valid JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### Create a New User

**Endpoint:** `POST /api/users`

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

### Get Current User

**Endpoint:** `GET /api/users/me`

**Description:** Retrieves the current user's profile information based on the JWT token.

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

### Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Description:** Retrieves a specific user's information by their ID.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id`: The MongoDB ObjectId of the user

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
- `400 Bad Request`: Invalid user ID format
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

## Error Responses

API endpoints may return error responses in this format:

```json
{
  "error": "Error message description"
}
```

Common errors:
- `Invalid user ID`
- `User not found`
- `userName already exists`
- `Password must be at least 6 characters long and include one uppercase letter, one number, and one special character`
- `gender must be male/female/other`
- `birthDate must be a valid date`

## Password Requirements

Passwords must meet the following requirements:
- At least 6 characters long
- Contains at least one uppercase letter
- Contains at least one number
- Contains at least one special character

## User Schema

The user object contains the following fields:

- `_id`: MongoDB ObjectId (unique identifier)
- `userName`: String (unique username for login)
- `firstName`: String
- `lastName`: String
- `gender`: String (Male, Female, or Other)
- `birthDate`: String (in YYYY-MM-DD format)
- `image`: String (Base64 encoded profile image)
- `createdAt`: Date (account creation timestamp)
- `lastLogin`: Date (last login timestamp)

The password is stored in the database but never returned in