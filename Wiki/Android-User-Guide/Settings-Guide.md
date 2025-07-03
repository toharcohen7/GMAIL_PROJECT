# Android App Settings Guide

This document explains the various settings and customization options available in the Gmail Project Android application.

## Accessing Settings

Unlike traditional Android apps with a dedicated settings screen, the Gmail Project app provides settings through the top bar menu:

1. Tap the three dots (⋮) in the top-right corner to access the menu options
2. Available options include:
   - User Profile
   - Dark/Light Mode Toggle
   - Sign Out

## Theme Settings

### Toggling Dark/Light Mode

The app supports both light and dark themes to reduce eye strain and battery consumption:

1. Tap the three dots (⋮) menu in the top-right corner
2. Select the Dark/Light Mode toggle option (moon/sun icon)
3. The interface will immediately update with the new theme
4. Your theme preference is automatically saved and remembered between sessions

**Implementation details:**
- Theme settings are stored in SharedPreferences with key "dark_mode"
- AppCompatDelegate.setDefaultNightMode() is used to apply the theme change

## Account Management

### Viewing User Profile

To view your account information:

1. Tap your profile picture in the top-right corner of the app
   (or select "User Profile" from the three dots menu)
2. A dialog will display your profile information:
   - Username
   - Full name (First name + Last name)
   - Gender
   - Birth date (formatted as DD/MM/YYYY)
   - Profile picture
3. Tap "Close" to return to the main interface

**Implementation details:**
- User information is retrieved from SharedPreferences in the "auth" store
- Profile image is displayed using Glide with circleCrop transformation

### Signing Out

To sign out from your account:

1. Tap the three dots (⋮) menu in the top-right corner
2. Select "Sign Out"
3. The app will:
   - Clear all stored credentials (SharedPreferences)
   - Terminate your current session
   - Return you to the Sign In screen
   - Clear the back stack to prevent returning to the inbox

**Implementation details:**
- SharedPreferences data is cleared with prefs.edit().clear().apply()
- A new Intent with FLAG_ACTIVITY_NEW_TASK and FLAG_ACTIVITY_CLEAR_TASK flags is used to restart the authentication flow

## Email Synchronization

### Manual Refresh

To manually refresh your emails and synchronize with the server:

1. Pull down on the email list (swipe down gesture)
2. The SwipeRefreshLayout will show a loading indicator
3. Latest emails will be fetched from the server
4. The list will update automatically when complete

**Implementation details:**
- SwipeRefreshLayout triggers mailViewModel.resetOffset() and mailViewModel.fetchMailsByLabel()
- Loading state is visually indicated by the refresh animation

### Auto-Refresh Behavior

The app automatically refreshes emails in these situations:
- When changing labels (through navigation drawer)
- After sending an email
- After moving emails to different labels
- After marking emails as spam or not spam

## Cache Management

The app uses Room Database to cache emails and user data. While there's no explicit cache clearing option in the UI, the following behaviors are implemented:

- Local database is cleared when signing in to ensure fresh data
- Emails are cached for offline access
- Changes made offline are synchronized when internet connection is restored

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