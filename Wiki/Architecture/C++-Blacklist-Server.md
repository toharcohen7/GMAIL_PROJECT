# C++ Blacklist Server Architecture

This document describes the architecture and implementation of the C++ Blacklist Server component in the Gmail Project.

## Overview

The Blacklist Server is a high-performance C++ component responsible for filtering spam and malicious content by checking URLs against a blacklist. It provides real-time URL checking capabilities to help protect users from harmful content.

## Architecture

```
┌─────────────────┐     ┌─────────────────────────────┐
│   Node.js       │◄───►│       Blacklist Server      │
│   Server        │     │          (C++)              │
└─────────────────┘     └───────────────┬─────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────┐
                        │       Bloom Filter          │
                        │                             │
                        └───────────────┬─────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────┐
                        │     blacklist.txt           │
                        └─────────────────────────────┘
```

## Components

### TCP Socket Interface

- Exposes a TCP socket interface for the Node.js server to check URLs against blacklists
- Handles incoming connections and requests
- Processes commands for URL checking and blacklist management

### Bloom Filter Implementation

- Core C++ component that efficiently checks if URLs are potentially blacklisted
- Uses probabilistic data structure for constant-time lookups
- Configurable size and hash functions via environment variables
- Prevents false negatives (all blacklisted URLs are detected)

### Blacklist Storage

- Manages persistent storage of blacklisted URLs in blacklist.txt
- Loads blacklist at startup and saves changes when URLs are added or removed
- Provides operations for adding and removing URLs from the blacklist

## Performance Considerations

- Implemented in C++ for maximum performance
- Bloom Filter provides O(1) constant time lookups regardless of blacklist size
- Minimal memory footprint compared to traditional data structures
- Fast startup with efficient loading of blacklist data

## Integration Points

- TCP socket API for communication with the Node.js server
- File system for blacklist persistence
- Environment variables for configuration

## Deployment

The C++ Blacklist Server is deployed as a standalone service in its own container, allowing for independent scaling based on load.

## Configuration

Configuration parameters include:
- `SERVER_PORT`: Port for TCP socket communication (default: 12346)
- `BF_SIZE`: Bloom Filter size in bits (default: 8)
- `HASH_COUNTS`: Space-separated list of hash function counts (default: "3 5 7")

## Error Handling

- Graceful handling of connection failures
- Detailed error logging
- Automatic recovery mechanisms

## Operation Workflow

1. Node.js server connects to the C++ server via TCP socket
2. Node.js server sends URL checking or blacklist management commands
3. C++ server processes commands using the Bloom Filter
4. C++ server returns results to the Node.js server
5. Changes to the blacklist are persisted to blacklist.txt