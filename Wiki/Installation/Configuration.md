# Configuration Guide

This document details the configuration options for the Gmail Project.

## Environment-Based Configuration

The Gmail Project uses a `.env` file in the root directory for configuration. This approach simplifies deployment across different environments and keeps sensitive data out of version control.

## Core Configuration Parameters

### Server Configuration

```
# Server configuration
SERVER_PORT=12346       # C++ Bloom Filter Server port
NODE_PORT=12345         # Node.js API Server port
SERVER_HOST=gmail_server
ANDROID_API_HOST=10.0.2.2  # IP address for Android app to connect to server
```

- `SERVER_PORT`: Port for the C++ Bloom Filter server
- `NODE_PORT`: Port for the Node.js API server
- `SERVER_HOST`: Hostname for server connections
- `ANDROID_API_HOST`: IP address where Android can reach the server (10.0.2.2 for emulator, your machine's IP for physical devices)

### Bloom Filter Configuration

```
# Bloom Filter configuration
BF_SIZE=8               # Bloom Filter size
HASH_COUNTS="3 5 7"     # Hash functions
```

- `BF_SIZE`: Size of the Bloom Filter in bits
- `HASH_COUNTS`: Space-separated list of hash function counts

### Database Configuration

```
# MongoDB connection
MONGO_CONNECTION=mongodb://gmail_mongo:27017/email
```

- `MONGO_CONNECTION`: MongoDB connection string including host, port, and database name

## Environment-Specific Settings

### Docker Environment

When running with Docker Compose, the environment variables are automatically applied from the `.env` file. The MongoDB connection will use the service name as the hostname:

```
MONGO_CONNECTION=mongodb://gmail_mongo:27017/email
```

### Local Development

For local development without Docker, modify the MongoDB connection to use localhost:

```
MONGO_CONNECTION=mongodb://localhost:27017/email
```

## Customizing Configuration

To modify any configuration parameter:

1. Edit the `.env` file in the project root
2. Save your changes
3. Restart the affected services

Example of changing server ports to avoid conflicts:
```
SERVER_PORT=12348       # Changed from default 12346
NODE_PORT=12347         # Changed from default 12345
```

## Android App Configuration

The Android app can connect to the server automatically based on your `.env` settings:

```
# Android connection settings
ANDROID_API_HOST=10.0.2.2  # Use 10.0.2.2 for emulator
```

When using different devices:
- **For emulator**: Set `ANDROID_API_HOST=10.0.2.2` in your `.env` file
- **For physical device**: Set `ANDROID_API_HOST=192.168.1.100` (replace with your actual IP address) in your `.env` file

After changing these settings:
1. Restart the Docker services: `docker-compose restart`
2. The Android app will automatically connect using these
