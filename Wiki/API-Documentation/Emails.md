# Emails API

This document describes the endpoints for managing emails in the Gmail Project API.

## Overview

The Emails API provides endpoints for creating, retrieving, updating, and deleting emails. It supports operations such as sending emails, managing drafts, marking emails as read/unread, moving emails between labels, and handling spam.

## Authentication

All endpoints require authentication using a valid JWT token:

```
Authorization: Bearer <token>
```

Additionally, all requests must include a user-id header:

```
user-id: <userId>
```

## Endpoints

### Get Emails

**Endpoint:** `GET /api/mails`

**Description:** Retrieves emails for the authenticated user. Can be filtered by label.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**Query Parameters:**
- `labelName` (optional): Filter emails by label name (e.g., "Inbox", "Sent", "Draft", "Spam", "Trash")
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "mailStatus": "Received",
    "labelName": "Inbox", 
    "senderId": "60d21b4667d0d8992e610c86",
    "receiversNames": ["johndoe"],
    "subject": "Meeting Tomorrow",
    "content": "Let's meet tomorrow at 10am to discuss the project.",
    "starred": false,
    "onRead": false,
    "time": "Jun 22, 2023, 15:30",
    "timestamp": 1687446600000
  },
  {
    "_id": "60d21b4667d0d8992e610c87",
    "mailStatus": "Sent",
    "labelName": "Sent",
    "senderId": "60d21b4667d0d8992e610c85",
    "receiversNames": ["janedoe", "bobsmith"],
    "subject": "Project Update",
    "content": "Here's the latest update on our project...",
    "starred": true,
    "onRead": true,
    "time": "Jun 21, 2023, 09:45",
    "timestamp": 1687339500000
  }
]
```

**Status Codes:**
- `200 OK`: Successful request
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid token

### Create Email Draft

**Endpoint:** `POST /api/mails`

**Description:** Creates a new empty draft email.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**Response:**
```json
{
  "_id": "60d21b4667d0d8992e610c88",
  "userId": "60d21b4667d0d8992e610c85",
  "mailStatus": "Draft",
  "senderId": "60d21b4667d0d8992e610c85",
  "receiversNames": [],
  "subject": "",
  "content": "",
  "labelName": "Draft",
  "timestamp": 1687532900000,
  "formattedTime": "Jun 23, 2023, 15:15",
  "starred": false,
  "onRead": true
}
```

**Status Codes:**
- `201 Created`: Draft created successfully
- `401 Unauthorized`: Missing or invalid token

### Get Email by ID

**Endpoint:** `GET /api/mails/{id}`

**Description:** Retrieves a specific email by its ID.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**URL Parameters:**
- `id`: The ID of the email to retrieve

**Response:**
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "mailStatus": "Received",
  "labelName": "Inbox",
  "senderId": "60d21b4667d0d8992e610c86",
  "receiversNames": ["johndoe"],
  "subject": "Meeting Tomorrow",
  "content": "Let's meet tomorrow at 10am to discuss the project.",
  "starred": false,
  "onRead": true,
  "time": "Jun 22, 2023, 15:30"
}
```

**Status Codes:**
- `200 OK`: Successful request
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Email not found

### Update Email

**Endpoint:** `PATCH /api/mails/{id}`

**Description:** Updates an email. Can be used to edit drafts, mark emails as read/unread, star/unstar emails, or change labels.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`
- `Content-Type: application/json`

**URL Parameters:**
- `id`: The ID of the email to update

**Request Body (Update Draft):**
```json
{
  "subject": "Updated Project Proposal",
  "content": "Here's my updated proposal for the project...",
  "receiversNames": ["jane@example.com", "team@example.com"]
}
```

**Request Body (Mark as Read/Unread):**
```json
{
  "onRead": true
}
```

**Request Body (Star/Unstar):**
```json
{
  "starred": true
}
```

**Request Body (Change Label):**
```json
{
  "labelName": "Work"
}
```

**Request Body (Send Draft):**
```json
{
  "labelName": "Sent",
  "receiversNames": ["jane@example.com", "team@example.com"],
  "subject": "Project Proposal",
  "content": "Here's my proposal for the project..."
}
```

**Response:**
- Status: `200 OK` for draft updates, `204 No Content` for other updates
- For draft updates, returns the updated mail object

**Status Codes:**
- `200 OK`: Draft updated successfully
- `204 No Content`: Other update completed successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Email not found

### Delete Email

**Endpoint:** `DELETE /api/mails/{id}`

**Description:** Permanently deletes an email. Usually used for emails already in the Trash label.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**URL Parameters:**
- `id`: The ID of the email to delete

**Response:**
- Status: `204 No Content`
- Empty response body

**Status Codes:**
- `204 No Content`: Email deleted successfully
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Email not found

### Search Emails

**Endpoint:** `GET /api/mails/search/{query}`

**Description:** Searches for emails containing the specified query in the subject or content.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**URL Parameters:**
- `query`: The search query string

**Response:**
```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "mailStatus": "Received",
    "labelName": "Inbox",
    "senderId": "60d21b4667d0d8992e610c86",
    "receiversNames": ["johndoe"],
    "subject": "Project Meeting",
    "content": "Let's discuss the project tomorrow.",
    "starred": false,
    "onRead": true,
    "time": "Jun 22, 2023, 15:30",
    "timestamp": 1687446600000
  }
]
```

**Status Codes:**
- `200 OK`: Successful request
- `400 Bad Request`: Invalid query
- `401 Unauthorized`: Missing or invalid token

## Email Operations

### Managing Drafts

1. Create an empty draft with `POST /api/mails`
2. Update the draft with `PATCH /api/mails/{id}` to add content
3. Send the draft by updating it with `labelName: "Sent"` and required fields

### Moving Emails Between Labels

Use `PATCH /api/mails/{id}` with `labelName` set to the destination label:
- To move to Trash: `{ "labelName": "Trash" }`
- To mark as Spam: `{ "labelName": "Spam" }`
- To move to custom label: `{ "labelName": "Work" }`

### Marking Emails as Read/Unread

Use `PATCH /api/mails/{id}` with `onRead` parameter:
- To mark as read: `{ "onRead": true }`
- To mark as unread: `{ "onRead": false }`

### Starring/Unstarring Emails

Use `PATCH /api/mails/{id}` with `starred` parameter:
- To star: `{ "starred": true }`
- To unstar: `{ "starred": false }`

## Error Responses

API endpoints may return error responses in this format:

```json
{
  "error": "Error message description"
}
```

Common errors:
- `Missing or invalid user-id header`
- `User not found`
- `Mail not found`
- `Receiver(s) not found`
- `Cannot change label to Draft`
- `Cannot send mail without a receiver`