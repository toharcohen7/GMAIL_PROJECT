# Android App Settings Guide

This document explains the various settings and customization options available in the Gmail Project Android application.

## Accessing Settings

Unlike traditional Android apps with a dedicated settings screen, the Gmail Project app provides settings through the top bar menu:

Available options include:
   - User Profile
   - Dark/Light Mode Toggle
   - Sign Out

## Theme Settings

### Dark/Light Mode

The app supports both light and dark themes to reduce eye strain and battery consumption:

1. Tap the moon icon (for dark mode) or sun icon (for light mode) located in the top bar.
2. The interface will immediately update with the new theme.
3. Your theme preference is automatically saved and

## Account Management

### Viewing User Profile

To view your account information:

1. Tap your profile picture in the top-right corner of the app
2. A dialog will display your profile information:
   - Username
   - Full name (First name + Last name)
   - Gender
   - Birth date (formatted as DD/MM/YYYY)
   - Profile picture
3. Tap "Close" to return to the main interface

### Signing Out

To sign out from your account:

1. Tap the "Sign Out" button located in the top bar.
2. The app will:
   - Clear all stored credentials
   - Terminate your current session
   - Return you to the Sign In screen
   - Clear the back stack to prevent returning

## Email Synchronization

### Manual Refresh

To manually refresh your emails and synchronize with the server:

1. Pull down on the email list (swipe down gesture)
2. The SwipeRefreshLayout will show a loading indicator
3. Latest emails will be fetched from the server
4. The list will update automatically when complete

### Auto-Refresh Behavior

The app automatically refreshes emails in these situations:
- When changing labels (through navigation drawer)
- After sending an email
- After moving emails to different labels
- After marking emails as spam or not spam

## Privacy Features

### Spam Protection

The app integrates with the server-side blacklist filtering:

1. When emails are marked as spam, URLs within them are automatically added to the blacklist
2. When emails are unmarked as spam, their URLs are removed from the blacklist
3. Subsequent emails containing blacklisted URLs will be automatically filtered as spam

## System Integration

### Camera and Storage Permissions

The app requests the following permissions:
- Camera permission for taking profile photos during signup
- Storage permission for selecting images from gallery

These permissions are requested at runtime when needed and can be managed through the Android system settings if you need to change