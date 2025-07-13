# Gmail_Project

## Overview

The Gmail Project is a comprehensive email management system that combines server-side backend infrastructure with a React-based frontend. It offers features such as email management, label creation, blacklist handling, and user authentication.

### Components

- **Blacklist Server (C++):**  
  Efficiently manages blacklisted URLs using a persistent Bloom filter.

- **Node.js Gmail Server:**  
  Provides REST API endpoints and Gmail-like application logic, integrating with the Blacklist server.

- **React Client:**  
  A responsive and scalable user interface for managing emails, labels, drafts, and blacklisted URLs.

- **Android App:**  
  A mobile application for managing emails, labels, and blacklist functionality on Android devices.

## Documentation

This README provides a brief overview of the project and its components. For detailed and comprehensive guides, visit the [Project Wiki](Wiki/Home.md).

- [Docker Setup Guide](Wiki/Installation/Docker-Setup.md)
- [Android App Installation Guide](Wiki/Installation/Android-App-Installation-Guide.md)
- [API Documentation](Wiki/API-Documentation/Authentication.md)
- [Milestone Details](Wiki/Developer-Guide/Milestones.md)

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

Milestone 3 branch:

```sh
GPDTH-218-branch-for-milestone-3
```

Milestone 4 branch:

```sh
GPDTH-323-branch-for-milestone-4
```

## Building with Docker

This project is designed to build and run inside Docker containers. It uses GCC, CMake, Python3, Node.js, and npm to build and execute the application components.

---

## Running the Program

### Using Docker Compose

1. **Build and Start the Services**:
   - Run:
     ```sh
     docker-compose up --build
     ```
   - This command builds the Docker images and starts all services in one step.

2. **Start All Services Without Rebuilding**:
   - Run:
     ```sh
     docker-compose up
     ```
   - To run in detached mode (background):
     ```sh
     docker-compose up -d
     ```
> **Note**: Run `docker-compose build` first, then `docker-compose up`. Or use `docker-compose up --build` to do both.

3. **Stop and Clean Up**:
   - Stop the running containers:
     ```sh
     docker-compose down
     ```
   - To remove containers, images, and networks:
     ```sh
     docker-compose down --rmi all
     ```

4. **Override Runtime Arguments**:
   - Format:
     ```sh
     SERVER_PORT=<server port> NODE_PORT=<node port> BF_SIZE=<bloom filter size> HASH_COUNTS="<hash count 1> <hash count 2> ..." SERVER_HOST=<server host> docker-compose up --build
     ```
   - Example:
     ```sh
     SERVER_PORT=5555 NODE_PORT=5556 BF_SIZE=16 HASH_COUNTS="3 5 7 11" SERVER_HOST=gmail_server docker-compose up --build
     ```
>For a more comprehensive guide, visit the [Docker Setup Guide](Wiki/Installation/Docker-Setup.md).

### Running the Android App on an Emulator

1. **Open Android Studio**:  
   - Launch Android Studio on your computer.

2. **Set Up an Emulator**:  
   - Click on **AVD Manager** in the toolbar.  
   - Select **Create Virtual Device**.  
   - Choose a device and click **Next**.  
   - Select a system image (Android 7.0 or higher) and click **Next**.  
   - Name your emulator and click **Finish**.

3. **Run the App**:  
   - Open the Android project folder in Android Studio.  
   - Wait for Gradle to sync.  
   - Select your emulator from the dropdown menu.  
   - Click the green **Run** button.
   - The app will automatically launch in the emulator once installed.

>For a more comprehensive guide, visit the [Android App Installation Guide](Wiki/Installation/Android-App-Installation-Guide.md).
---

## Project Structure

```
GMAIL_PROJECT_D.T.H/
├── androidApp/                      # Android application
├── src/                             # Project source code
│   ├── client/                      # React frontend application
│   ├── blacklist/                   # C++ Bloom Filter server implementation
│   ├── server/                      # Node.js backend
├── images/                          # Documentation images
├── README.md                        # Project documentation
├── docker-compose.yml               # Docker Compose configuration
├── .env                             # Environment variables
```

For a detailed breakdown of the project structure, visit the [Project Structure Guide](Wiki/Architecture/Project-Structure.md).

## Requirements

- **Docker**: Install [Docker](https://www.docker.com/) (with Docker Compose) to build and run the application components in isolated containers.
- **Android Studio**: Required for running the Android app on an emulator. Download it from [Android Studio](https://developer.android.com/studio).
- **Web Browser**: Use a modern web browser (e.g., Chrome, Firefox) to access the React client.
