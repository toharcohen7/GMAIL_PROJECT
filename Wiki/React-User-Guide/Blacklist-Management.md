# Blacklist Management

This guide explains how to use the URL blacklisting feature in the Gmail Project to protect yourself from spam and malicious content.

## Understanding URL Blacklisting

The Gmail Project implements a sophisticated URL blacklisting system that:
- Automatically detects and blacklists URLs when you move emails to the spam
- Prevents future emails containing blacklisted URLs from reaching your inbox
- Uses an efficient Bloom Filter data structure for high-performance filtering
- Maintains a persistent blacklist across sessions

## How URL Blacklisting Works

1. **Automatic URL Detection**: When you mark emails as spam, the system automatically extracts URLs from both the subject and content
2. **Bloom Filter Technology**: The C++ Blacklist Server maintains a Bloom Filter for efficient URL lookups
3. **Persistent Storage**: Blacklisted URLs are stored in a persistent file for continued protection

## Managing Your Blacklist

### Adding URLs to the Blacklist

URLs are automatically added to the blacklist when:

1. You mark an email as spam:
   - Select one or more emails in your inbox
   - Click the "Mark as Spam" button (shield icon with X) in the toolbar
   - All URLs contained in these emails will be automatically extracted and added to the blacklist

### Viewing Spam Emails

1. Click on the "Spam" label in the sidebar
2. Review emails that have been marked as spam
3. These emails may contain URLs that have been blacklisted

### Removing URLs from the Blacklist

**Method 1: Using the Blacklist Management Button**
1. Hover over the "Spam" label in the sidebar
2. Click the "Remove URL from Blacklist" button (shield with slash icon) that appears
3. In the dialog that opens:
   - Enter the URL you want to remove from the blacklist
   - Click the "Delete from Blacklist" button
4. You'll receive a confirmation message when the URL is successfully removed

**Method 2: Removing Emails from Spam**
1. Go to the "Spam" folder by clicking the "Spam" label in the sidebar
2. Select the email(s) you want to mark as not spam
3. Click the "Not Spam" button (shield with check icon) in the toolbar
4. The URLs contained in these emails will be automatically removed from the blacklist

## Technical Implementation

The blacklisting system consists of:

1. **C++ Blacklist Server**: High-performance server using Bloom Filter technology
2. **Node.js API**: Middleware that connects the frontend to the blacklist server
3. **Frontend Components**: UI elements for managing blacklisted URLs

## Best Practices

### Effective Spam Management

- Regularly review your spam folder for false positives
- Be selective when marking messages as spam or not spam
- Use the blacklist management tool to manually remove incorrectly blacklisted URLs
- Remember that removing an email from spam will also remove its URLs from the blacklist

### Understanding Limitations

- A Bloom Filter may occasionally produce false positives (URLs incorrectly identified as blacklisted)
- The blacklist focuses on URLs, not email addresses or domains
- Very sophisticated spam may attempt to obfuscate URLs to avoid detection
