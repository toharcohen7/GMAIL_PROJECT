# Android Client Architecture

This document describes the architecture of the Android-based mobile client for the Gmail Project.

## Overview

The Android client provides a native mobile experience for the Gmail application, allowing users to access their emails, manage labels, and communicate effectively while on the go. It is designed following the MVVM (Model-View-ViewModel) architectural pattern to ensure separation of concerns, testability, and maintainability.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                Android Application              │
├───────────────┬─────────────────┬───────────────┤
│      View     │    ViewModel    │     Model     │
│  (Activities/ │    (LiveData/   │ (Repository/  │
│   Fragments)  │    Observer)    │    Entity)    │
└───────┬───────┴────────┬────────┴───────┬───────┘
        │                │                │
┌───────▼────────┐ ┌─────▼─────┐  ┌───────▼───────┐
│  UI Components │ │ LiveData  │  │  Repository   │
│  (XML Layouts) │ │ Observers │  │    Layer      │
└────────────────┘ └───────────┘  └───────┬───────┘
                                          │
                       ┌──────────────────┼──────────────────┐
                       │                  │                  │
               ┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
               │  API Service  │  │ Room Database │  │ SharedPrefs   │
               │  (Retrofit)   │  │ (Local Cache) │  │  (Settings)   │
               └───────┬───────┘  └───────────────┘  └───────────────┘
                       │
               ┌───────▼───────┐
               │  Backend API  │
               └───────────────┘
```

## Key Components

### View Layer

- **Activities**: Main container components for the application
  - `MainActivity`: Hosts the main navigation drawer and fragments
  - `AuthActivity`: Handles login and registration flows

- **Fragments**: UI components for specific features
  - `HomeFragment`: Main email listing screen with label-specific content
  - `EmailDetailFragment`: Displays individual email content
  - `ComposeFragment`: Interface for creating new emails
  - `SettingsFragment`: User preferences and app configuration

- **Adapters**: Convert data into UI elements
  - `EmailListAdapter`: Renders email items in RecyclerView
  - `LabelAdapter`: Manages navigation drawer labels

### ViewModel Layer

- **ViewModels**: Expose data to the UI and handle user interactions
  - `HomeViewModel`: Manages email list operations and state
  - `EmailViewModel`: Handles individual email operations
  - `ComposeViewModel`: Manages email drafting and sending
  - `AuthViewModel`: Handles authentication operations

- **LiveData**: Observable data holders for reactive UI updates
  - `MutableLiveData<List<Mail>>`: Email lists for different labels
  - `MutableLiveData<User>`: Current user information
  - `MutableLiveData<Boolean>`: Loading states and operation results

### Model Layer

- **Repositories**: Abstracts data sources and provides a clean API
  - `MailRepository`: Handles all email-related operations
  - `UserRepository`: Manages user authentication and profile data
  - `LabelRepository`: Controls label creation and management

- **Entities**: Data models representing core objects
  - `Mail`: Email message with metadata
  - `User`: User profile information
  - `Label`: Email categorization structure

### Data Sources

- **Remote Data Source**: Server communication
  - `ApiService`: Retrofit interface for API endpoints
  - `AuthInterceptor`: Adds authentication headers to requests
  - `NetworkUtils`: Handles connection state and retries

- **Local Data Source**: Persistent storage
  - `AppDatabase`: Room database for offline caching
  - `MailDao`: Data access object for emails
  - `LabelDao`: Data access object for labels
  - `UserDao`: Data access object for user data

- **Preferences**: User settings and token storage
  - `SharedPreferencesManager`: Wrapper for Android SharedPreferences
  - Stores JWT token, user preferences, and app settings

## Feature Modules

### Email Management

- **Email Listing**: Displays emails with sorting and filtering
  - Shows unread status, sender, subject, and timestamp
  - Supports pull-to-refresh for synchronization

- **Email Detail**: Shows full email content with actions
  - Reply, forward, delete, mark as spam options
  - Attachment viewing capability

- **Email Composition**: Interface for creating new emails
  - Rich text editing
  - Recipient auto-completion
  - Draft saving and management

### Label Management

- **System Labels**: Inbox, Sent, Draft, Spam, Trash
  - Fixed labels with special behaviors
  - Unread counts and notifications

- **Custom Labels**: User-defined categories
  - Create, edit, and delete operations
  - Moving emails between labels

### Search and Filtering

- **Email Search**: Find messages across labels
  - Full-text search in subjects and content
  - Filters by sender, date, and read status

- **Spam Detection**: Integration with server-side blacklist
  - Mark/unmark emails as spam
  - Automatic filtering based on blacklist

## Data Flow

1. **Remote Data Flow**:
   - User action triggers ViewModel method
   - ViewModel calls Repository method
   - Repository makes API request through Retrofit
   - Response is processed and returned as LiveData
   - UI observes LiveData changes and updates

2. **Local Data Flow**:
   - Repository checks Room database for cached data
   - If available and fresh, returns local data
   - If stale or unavailable, fetches from API
   - New data is cached in Room database
   - UI updates from LiveData observations

3. **Offline Support Flow**:
   - Repository attempts network operation
   - If offline, queues operation for later execution
   - Returns cached data when available
   - Syncs changes when connectivity is restored

## Integration Points

### Backend API Integration

The Android client communicates with the Node.js backend API through REST endpoints:

- **Authentication**: JWT-based authentication
  - Login/logout operations
  - Token refresh mechanisms

- **Email Operations**:
  - Fetch emails by label
  - Create, read, update, delete emails
  - Mark as read/unread/spam

- **Label Operations**:
  - List all labels
  - Create, update, delete custom labels
  - Move emails between labels

### Configuration and Environment

- **Dynamic Configuration**: Fetches configuration from server
  - API endpoints
  - Feature flags
  - Application settings

- **Environment Variables**:
  - Uses `ANDROID_API_HOST` from server configuration
  - Adapts between emulator (10.0.2.2) and physical device IPs

## Offline Capabilities

### Local Caching

- **Email Caching**: Stores recently viewed emails
  - Uses Room database for structured storage
  - Implements cache invalidation policies

- **Background Synchronization**:
  - WorkManager for scheduled syncs
  - Conflict resolution for offline changes

### Pending Operations

- **Operation Queue**:
  - Stores operations attempted while offline
  - Executes in order when connectivity returns

- **Conflict Resolution**:
  - Detects server-client conflicts
  - Implements resolution strategies (server wins, merge, etc.)

## Security Considerations

- **Token Management**:
  - Secure storage of JWT tokens
  - Automatic token refresh
  - Secure deletion on logout

- **Encrypted Storage**:
  - Sensitive data encrypted at rest
  - Uses Android Keystore for key management
