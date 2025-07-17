# Architecture Overview

This document provides a high-level overview of the Gmail Project architecture.

## System Architecture

The Gmail Project follows a microservices architecture pattern, with core services working together to provide a complete email solution.

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │◄────►│   Node.js       │◄────►│   Android App   │
│   (React)       │      │   Server        │      │                 │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                          ┌───────┴───────┐
                          ▼               ▼
                 ┌─────────────────┐    ┌─────────────────┐
                 │ Blacklist       │    │   MongoDB       │
                 │ Service (C++)   │    │   Database      │
                 └─────────────────┘    └─────────────────┘
```

## Component Descriptions

### Frontend Layer

The web interface built with React provides the user interface for desktop users, allowing email management, composition, and organization.

### Node.js Server

Core application server handling:
- API endpoints for frontend and mobile clients
- Email operations (sending, receiving, and processing)
- User authentication and session management
- User profile and preferences management
- Communication with the Blacklist service for spam detection

### Android App

Native Android application providing mobile access to the email service with similar functionality to the web interface.

### Blacklist Service

C++ service for high-performance filtering of spam and unwanted emails. It uses Bloom Filters for efficient lookups and maintains a persistent blacklist.txt file to store banned URLs across system restarts.

### Database

MongoDB database storing user data, emails, and system configurations.

## Communication Patterns

- **REST APIs**: Used for communication between frontend/Android app and the Node.js server
- **TCP Socket Communication**: Used for communication between Node.js server and C++ Blacklist service

## Data Flow

1. User interacts with the Frontend or Android App
2. Requests are sent to the Node.js Server
3. The Node.js Server processes the request, consulting the Blacklist Service for spam detection when needed
4. The Node.js Server interacts with the MongoDB database to store or retrieve data
5. Results are returned to the user interface

## Security Architecture

- Authentication and authorization for user access
- Blacklist filtering for spam prevention
- Input validation to prevent injection attacks
- Secure password storage

## Next Steps

Now that you understand the overall architecture, explore these guides for more details:

- [React Client Architecture](React-Client.md) - Detailed view of the web client implementation
- [Android Client Architecture](Android-Client.md) - Technical structure of the mobile application
- [Node Server Architecture](Node-Server.md) - In-depth look at the API server
- [C++ Blacklist Server](C++-Blacklist-Server.md) - Technical details of the spam filtering service
- [Database Structure](Database-Structure.md) - MongoDB schema and data models
