# Labels API

This document describes the endpoints for managing email labels in the Gmail Project API.

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

### Get All Labels

**Endpoint:** `GET /api/labels`

**Description:** Retrieves all labels for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**Response:**
```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Draft",
    "iconClass": "bi bi-inbox-fill",
    "countBadge": 2
  },
  {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Sent",
    "iconClass": "bi bi-send",
    "countBadge": 0
  },
  {
    "_id": "60d21b4667d0d8992e610c87",
    "name": "Received",
    "iconClass": "bi bi-file-earmark",
    "countBadge": 3
  },
  {
    "_id": "60d21b4667d0d8992e610c88",
    "name": "Spam",
    "iconClass": "bi bi-exclamation-octagon",
    "countBadge": 1
  },
  {
    "_id": "60d21b4667d0d8992e610c89",
    "name": "Trash",
    "iconClass": "bi bi-trash",
    "countBadge": 0
  },
  {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Work",
    "iconClass": "bi bi-tag",
    "countBadge": 2
  }
]
```

**Status Codes:**
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Missing or invalid token

### Get Label by Name

**Endpoint:** `GET /api/labels/{name}`

**Description:** Retrieves a specific label by its name.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**URL Parameters:**
- `name`: Name of the label to retrieve

**Response:**
```json
"Work"
```

**Status Codes:**
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Label not found

### Create Label

**Endpoint:** `POST /api/labels`

**Description:** Creates a new custom label.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Personal",
  "iconClass": "bi bi-tag"
}
```

**Response:**
```json
{
  "_id": "60d21b4667d0d8992e610c91",
  "userId": "60d21b4667d0d8992e610c80",
  "name": "Personal",
  "iconClass": "bi bi-tag",
  "countBadge": 0
}
```

**Status Codes:**
- `201 Created`: Label created successfully
- `400 Bad Request`: Invalid input data or missing required fields
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Label name already exists for this user

### Update Label

**Endpoint:** `PATCH /api/labels/{name}`

**Description:** Updates an existing label. Only the name can be updated.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`
- `Content-Type: application/json`

**URL Parameters:**
- `name`: Name of the label to update

**Request Body:**
```json
{
  "name": "Personal Projects"
}
```

**Response:**
- Status: `204 No Content`
- Empty response body

**Status Codes:**
- `204 No Content`: Label updated successfully
- `400 Bad Request`: Invalid input data or protected label
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Label not found
- `409 Conflict`: New label name already exists for this user

### Delete Label

**Endpoint:** `DELETE /api/labels/{name}`

**Description:** Deletes a custom label. Cannot delete system labels.

**Headers:**
- `Authorization: Bearer <token>`
- `user-id: <userId>`

**URL Parameters:**
- `name`: Name of the label to delete

**Response:**
- Status: `204 No Content`
- Empty response body

**Status Codes:**
- `204 No Content`: Label deleted successfully
- `400 Bad Request`: Cannot delete protected label
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Label not found

## Protected Labels

The following labels are system labels and cannot be edited or deleted:
- Draft
- Sent
- Received (Inbox)
- Spam
- Trash

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
- `Label name is required`
- `Label not found`
- `Another label with this name already exists`
- `Cannot delete protected label`
- `Cannot update protected label`