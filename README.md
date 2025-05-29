# Gmail_Project

## Overview

This project implements a Bloom Filter and related functionality in C++ using a client-server architecture.  
It includes a C++ server (`runServer`), a Python client (`client.py`), and a test suite (`runTest`) using GoogleTest.

## Milestones

If you like to see a previous milestone please connect to the designated branch

Milestone 1 branch:

```sh
GPDTH-99-branch-for-milestone-1
```

Milestone 2 branch:

```sh
GPDTH-165-branch-for-milestone-2
```

## Building with Docker

The project is set up to build and run inside a Docker container using GCC, CMake, and Python3.

### Build the Docker Image

From the project root directory, run:

```sh
docker build -t gmail_project .
```

## Running the Program

### Running the Server

You can run the server in several ways:

#### 1. Using the Provided Script

Run:
```
./rscripts/run_server.sh <port> <bloom_filter_size> <hash_count> [additional_hash_counts...]
```
**Example:**
```
./rscripts/run_server.sh 12345 8 3
```
> **Note:** If you don't have permissions, give the script execute permission with  
> `chmod +x ./rscripts/run_server.sh`

#### 2. Using Docker Directly

**General format:**
```
docker run -p <port>:<port> gmail_project ./runServer <port> <bloom_filter_size> <hash_count> [additional_hash_counts...]
```
- `<port>`: Port number (**1024–65535**)
- `<bloom_filter_size>`: Bloom filter size
- `<hash_count>`: Number of hash functions (add more numbers for more hash functions if needed)

**Example:**
```
docker run -p 12345:12345 gmail_project ./runServer 12345 8 3
```
---


### Running the Client

You can also run the client in multiple ways:

#### 1. Using the Provided Script

Run:
```
./rscripts/run_client.sh <port> <ip_address>
```
**Example:**
```
./rscripts/run_client.sh 12345 127.0.0.1
```
> **Note:** If you don't have permissions, give the script execute permission with  
> `chmod +x ./rscripts/run_client.sh`

#### 2. Using Docker Directly

**General format:**
```
docker run -it --network="host" gmail_project python3 /usr/src/mytest/src/blacklist/client.py <port> <ip_address>
```
- `<port>`: Port number to connect to (**should match the server port**)

**Example:**
```
docker run -it --network="host" gmail_project python3 /usr/src/mytest/src/blacklist/client.py 12345 127.0.0.1
```
---

*Note: The specific command examples above are just for illustration. You can use any valid port (1024–65535) and parameters as needed.*

### Running the Test Suite

To run the GoogleTest-based test suite:

```sh
docker run gmail_project ./runTest
```

- This will execute all unit tests and print the results.

## Usage Instructions

After starting both server and client, interact with the system through the client terminal using the following commands:

1. **POST (Add a URL to the blacklist):**
   ```
   POST www.example.com
   ```

2. **GET (Check if a URL is blacklisted):**
   ```
   GET www.example.com
   ```

3. **DELETE (Remove a URL from the blacklist):**
   ```
   DELETE www.example.com
   ```

- The server will respond with the result of your command.

---

**Note:**  
- Only input lines in the correct format will be processed; all others are ignored.
- Output must match the examples exactly (no extra spaces, newlines, or text).
- The Bloom filter is persistent between runs via a file.

## Program Flow

1. **Start the server** in one terminal with the desired configuration (port, bloom filter size, hash count).
2. **Start the client** in another terminal and connect to the server.
3. **Send commands** from the client to the server using the POST, GET, and DELETE formats as shown above.
4. **Server processes the commands** and responds accordingly.
5. **Bloom filter state is saved** after every update and loaded automatically on server restart.

> **Note:** The program runs in an infinite loop and does not have a built-in exit option; you can only stop it by killing the process.

### Examples

**Build Command:**  
![Build Command](images/1.jpeg)

**runTest Command:**  
![runTest Command](images/2.jpeg)

**Server Run Command:**  
![Server Run Command](images/3.jpeg)

**Client Run Command:**  
![Client Run Command](images/4.jpeg)

**Sample Client Interaction:**  
![Sample Client Interaction](images/5.jpeg)

---

## Project Structure

- `src/main.cpp` — Server program entry point
- `src/server.cpp/hpp` — Server implementation
- `src/socketHandler.cpp/hpp` — Socket communication handling
- `src/client.py` — Python client implementation
- `src/bloomFilter.cpp/hpp`, `src/immortalBloomFilter.cpp/hpp` — Bloom filter implementation
- `src/test.cpp` — Test suite
- `CMakeLists.txt` — Build configuration
- `Dockerfile` — Docker configuration

## Requirements

- Docker
- Two terminal windows (one for server, one for client)