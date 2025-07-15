# Development Environment Setup

This document provides instructions for setting up a development environment for the Gmail Project.

## Requirements

- Node.js v14+ for JavaScript development
- JDK 11+ for Java development
- C++ compiler (g++ 9+)
- IDE recommendations:
  - Visual Studio Code for JavaScript/CSS
  - IntelliJ IDEA for Java
  - Visual Studio/CLion for C++
  - Android Studio for mobile development

## Setting Up Local Environment

### JavaScript Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

### C++ Server

1. Build the project:
   ```bash
   mkdir build && cd build
   cmake ..
   make
   ```

2. Run the server:
   ```bash
   ./server
   ```

### Android App

1. Open the `androidApp` folder in Android Studio
2. Sync Gradle dependencies
3. Run on an emulator or physical device

## Environment Variables

Use the `.env` file in the root directory with the following variables:
```
# Server configuration
SERVER_PORT=12346       # C++ Bloom Filter Server port
NODE_PORT=12345         # Node.js API Server port

# Bloom Filter configuration
BF_SIZE=8               # Bloom Filter size
HASH_COUNTS="3 5 7"     # Hash functions

# Connection settings
SERVER_HOST=gmail_server
MONGO_CONNECTION=mongodb://gmail_mongo:27017/email
```

> **Note:** You can modify the port settings (`SERVER_PORT` and `NODE_PORT`) to avoid conflicts with other services running on your machine. Simply update the values in this file as needed.

## Database Setup

### Using Docker (Recommended)
1. Simply run the Docker Compose setup:
   ```bash
   docker-compose up -d
   ```
   This will automatically set up MongoDB with the required database.

### Local Development (Without Docker)
1. Install MongoDB
2. Set up MongoDB to run on port 27017 (default port)
3. Create a database named "email"
4. Use this connection string in your `.env` file:
   ```
   MONGO_CONNECTION=mongodb://localhost:27017/email
   ```

## Debugging Tips

- Use browser developer tools for frontend debugging
- Configure remote debugging in your IDE for containerized applications
- Check logs in the `logs` directory for runtime issues