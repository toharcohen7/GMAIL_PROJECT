# Blacklist API

This document describes the endpoints for managing the URL blacklist in the Gmail Project API.

## Overview

The blacklist API allows managing URLs that should be blocked in emails. It's powered by a C++ server using a Bloom Filter for efficient URL checking. When emails are marked as spam, their URLs are automatically added to this blacklist.

## Authentication

All endpoints require authentication using a valid JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### Add URL to Blacklist

**Endpoint:** `POST /api/blacklist`

**Description:** Adds a URL to the blacklist.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "url": "www.malicious-site.com"
}
```

**Response:**
- Status: `201 Created` - URL successfully added to blacklist
- Empty response body

**Status Codes:**
- `201 Created`: URL added successfully
- `400 Bad Request`: Invalid URL or missing URL parameter
- `401 Unauthorized`: Missing or invalid token

### Remove URL from Blacklist

**Endpoint:** `DELETE /api/blacklist/{url}`

**Description:** Removes a URL from the blacklist.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `url`: URL-encoded string of the URL to remove from the blacklist

**Response:**
- Status: `204 No Content` - URL successfully removed from blacklist
- Empty response body

**Status Codes:**
- `204 No Content`: URL removed successfully
- `400 Bad Request`: Invalid URL format
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: URL not found in blacklist

### Check if URL is in Blacklist

**Endpoint:** `GET /api/blacklist/check`

**Description:** Checks if a URL is present in the blacklist.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "url": "www.suspicious-site.com"
}
```

**Response:**
```json
{
  "isInBlacklist": true
}
```

**Status Codes:**
- `200 OK`: Check performed successfully
- `400 Bad Request`: Invalid URL or missing URL parameter
- `401 Unauthorized`: Missing or invalid token

## Implementation Notes

- The blacklist is implemented using a Bloom Filter for efficient lookup
- URLs are stored persistently in a file maintained by the C++ server
- When emails are marked as spam, all URLs found in both subject and content are automatically added to the blacklist
- When emails are removed from spam, their URLs are automatically removed from the blacklist
- The Bloom Filter guarantees no false negatives (all blacklisted URLs are detected)
- **URL Validation Regex:** The server uses the following regex to validate URLs:

```sh
 ^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+.\-])://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$
 ```

## Error Responses

API endpoints may return error responses in this format:

```json
{
  "error": "Error message description"
}
```

Common errors:
- `URL is required`
- `Failed to add URL to blacklist`
- `Failed to delete URL from blacklist`
- `URL not found in blacklist`
- `Invalid URL or request`