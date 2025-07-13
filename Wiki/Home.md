# Gmail Project Wiki

Welcome to the Gmail Project Wiki! This wiki contains comprehensive documentation for our email application system developed by D.T.H team.

## Project Overview

This project aims to create the best Gmail experience ever! Our application combines modern technology stacks, to deliver a comprehensive email solution with advanced features.

## Technology Stack

- **Frontend**: JavaScript, CSS
- **Backend**: JavaScript, C++
- **Mobile**: Java, XML (Android App)
- **Deployment**: Docker, CMakeFile, Shell Scripts

## Repository Structure

```
GMAIL_PROJECT_D.T.H/
├── androidApp/                      # Android application
├── src/                             # Project source code
│   ├── client/                      # React frontend application
│   │   ├── .gitignore               # Git ignore file for React client
│   │   ├── package.json             # React client dependencies
│   │   ├── src/                     # React source code
│   │       ├── components/          # Reusable UI components
│   │       │   ├── Inbox/           # Inbox-related components
│   │       │   ├── SideBar/         # Sidebar and label management
│   │       │   ├── TopBar/          # Top navigation bar
│   │       │   ├── SignUp/          # Sign-up form components
│   │       │   ├── SignIn/          # Sign-in form components
│   │       │   ├── FetchWithAuth/   # Authenticator component
│   │       │   ├── Styles/          # Styles component
│   │       │   
│   │       ├── pages/  
│   │       │   ├── SignUp/          # Sign-up page
│   │       │   ├── SignIn/          # Sign-in page
│   │       │   ├── MainPage/        # Main application page
│   │       │   ├── WelcomePage/     # Welcome page
│   │       │
│   │       ├── utils/               # Utility functions
│   │       ├── config/              # Configuration files (e.g., API URLs)
│   │       ├── index.js             # Application entry point
│   │       ├── App.js               # Main application component
│   │
│   ├── blacklist/                   # C++ Bloom Filter server implementation
│   │   ├── cpp/                     # C++ source files
│   │   ├── hpp/                     # C++ header files
│   │   ├── client.py                # Python client for testing the server
│   │
│   ├── server/ 
│       ├── controllers/                 # Node.js controllers for handling API logic
│       ├── models/                      # Node.js models for database and application logic
│       ├── routes/                      # Node.js routes for API endpoints
│       │── app.js                       # Main Node.js server file
│       │── package.json                 # Node.js server dependencies
│
├── images/                          # Project images for documentation  
├── .env                             # Environment variables for the project
├── .dockerignore                    # Docker ignore file
├── .gitignore                       # Git ignore file
├── CMakeLists.txt                   # CMake configuration for building the C++ server
├── Dockerfile                       # Dockerfile for building the project
├── docker-compose.yml               # Docker Compose configuration
├── README.md                        # Project documentation
├── details.txt                      # Project details (authors, repository link, etc.)
```

## Team

The D.T.H team is responsible for the development and maintenance of this project.

### Members
- Daniel Jenudi
- Harel Mizrahi
- Tohar Yahakov Cohen

## Navigation Map

### Installation & Setup
- [Docker Setup Guide](Installation/Docker-Setup.md) (Recomended as first step)
  - [Configuration Guide](Installation/Configuration.md)
    - [Environment Variables](Installation/Configuration.md#environment-based-configuration)
    - [Server Configuration](Installation/Configuration.md#server-configuration)
    - [Android Configuration](Installation/Configuration.md#android-app-configuration)
  - [Android App Installation Guide](Installation/Android-App-Installation-Guide.md)
  - [Development Environment](Installation/Development-Environment.md)

### User Guides
- [Android Client](Android-User-Guide/Getting-Started.md)
  - [Overview](Android-User-Guide/Overview.md)
  - [User Interface](Android-User-Guide/User-Interface.md)
  - [Features Guide](Android-User-Guide/Features-Guide.md)
  - [Settings Guide](Android-User-Guide/Settings-Guide.md)
- [React Web Client](React-User-Guide/Getting-Started.md)
  - [Email Management](React-User-Guide/Email-Management.md)
  - [Labels and Organization](React-User-Guide/Labels-and-Organization.md)
  - [Account Management](React-User-Guide/Account-Management.md)
  - [Blacklist Management](React-User-Guide/Blacklist-Management.md)

### Architecture & Development
- [System Architecture](Architecture/Overview.md)
  - [React Client Architecture](Architecture/React-Client.md)
  - [Android Client Architecture](Architecture/Android-Client.md)
  - [C++ Blacklist Server](Architecture/C++-Blacklist-Server.md)
  - [Database Structure](Architecture/Database-Structure.md)
- [API Documentation](API-Documentation/Authentication.md)
  - [Authentication](API-Documentation/Authentication.md)
  - [Emails API](API-Documentation/Emails.md)
  - [Labels API](API-Documentation/Labels.md)
  - [Users API](API-Documentation/Users.md)
  - [Blacklist API](API-Documentation/Blacklist.md)
- [Developer Guide](Developer-Guide/Code-Standards.md)
  - [Milestones](Developer-Guide/Milestones.md)

