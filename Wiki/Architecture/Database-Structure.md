# Database Structure

This document outlines the database schema design for the Gmail Project.

## Database Technology

The Gmail Project uses MongoDB as its primary NoSQL database for storing email data, user information, and other application data.

## Collection Schemas

### Users Collection

```js
{
  _id: ObjectId,
  username: String,     // Unique username
  password: String,     // Password
  firstName: String,    // User's first name
  lastName: String,     // User's last name
  gender: String,       // User's gender
  birthDate: String,    // User's birth date
  image: String,        // Base64 encoded profile image
  createdAt: Date,      // Account creation timestamp
  lastLogin: Date       // Last login timestamp
}
```

### Mails Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,           // User who can see this mail
  mailStatus: String,         // "Draft", "Sent", or "Received"
  senderId: ObjectId,         // User who sent the mail
  receiversNames: [String],   // Array of recipient usernames
  subject: String,            // Mail subject
  content: String,            // Mail content/body
  labelName: String,          // Current label ("Inbox", "Sent", "Spam", "Trash", etc.)
  timestamp: Date,            // When the mail was sent
  formattedTime: String,      // Human-readable time
  starred: Boolean,           // Whether the mail is starred
  onRead: Boolean             // Whether the mail has been read
}
```

### Labels Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,          // User who owns this label
  name: String,              // Label name
  iconClass: String,         // Bootstrap icon class
  count: Number,             // Count of unread emails
  createdAt: Date            // When the label was created
}
```

## Indexes

```js
// Users collection
db.users.createIndex({ "username": 1 }, { unique: true })

// Emails collection
db.mails.createIndex({ "userId": 1 })
db.mails.createIndex({ "senderId": 1 })
db.mails.createIndex({ "labelName": 1 })
db.mails.createIndex({ "timestamp": -1 })

// Labels collection
db.labels.createIndex({ "userId": 1, "name": 1 }, { unique: true })
```

## Data Relationships

- Users have many Mails (sent or received)
- Users have many Labels
- Mails belong to a single Label at a time
- Labels track unread mail counts

## Data Flow Examples

### When a mail is sent:
1. A mail is created for the sender with `labelName: "Sent"` and `mailStatus: "Sent"`
2. For each recipient, a copy of the mail is created with `labelName: "Received"`, `mailStatus: "Received"`, and `onRead: false`
3. The recipient's "Received" label count is incremented

### When a mail is marked as read:
1. The `onRead` field is updated to `true`
2. If the mail was previously unread, the label count is decremented

### When a mail is moved to a different label:
1. The `labelName` field is updated
2. If the mail is unread, the old label count is decremented and the new label count is incremented

## System Labels

The system creates these default labels for each user:
- Draft: For unsent mails
- Sent: For sent mails
- Received: For received mails
- Spam: For spam mails
- Trash: For deleted mails

Users can create additional custom labels as needed.