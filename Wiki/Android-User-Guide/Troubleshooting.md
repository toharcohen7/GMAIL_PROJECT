# Android App Troubleshooting Guide

This document provides solutions to common issues you might encounter when using the Gmail Project Android application.

## Authentication Issues

### Cannot Sign In

**Issue**: Unable to log in to the application.

**Solutions**:
1. Verify your username and password are correct
2. Check your internet connection
3. Ensure the server is running and accessible
4. Try clearing app data:
   - Go to Settings > Apps > Gmail Project > Storage > Clear Data
   - Note: This will remove your saved credentials

**Technical Details**:
- The app uses JWT tokens stored in SharedPreferences
- If token storage is corrupted, sign-in may fail

### Registration Failed

**Issue**: Cannot create a new account.

**Solutions**:
1. Ensure all required fields are completed:
   - Username (must be unique)
   - Password (must meet complexity requirements)
   - First name and last name
   - Gender
   - Birth date
   - Profile photo
2. Check if username already exists
3. Verify that password and confirm password match exactly
4. Ensure you have a stable internet connection

## Email Display Issues

### Emails Not Loading

**Issue**: Email list is empty or not updating.

**Solutions**:
1. Pull down on the email list to manually refresh
2. Check your internet connection
3. Verify you're looking at the correct label
4. Try closing and reopening the app
5. If persistent, sign out and sign back in

**Technical Details**:
- Email fetching uses pagination with offset parameters
- The SwipeRefreshLayout resets the offset when pulled

### Cannot View Email Content

**Issue**: Unable to open or view email content.

**Solutions**:
1. Check if the email has valid content
2. Ensure you have internet connection for emails not cached
3. Try reopening the app
4. If persistent, clear app cache:
   - Settings > Apps > Gmail Project > Storage > Clear Cache

## Sending Email Issues

### Cannot Send Email

**Issue**: Unable to send emails.

**Solutions**:
1. Ensure you have entered at least one recipient (required)
2. Check your internet connection
3. Verify recipient usernames exist in the system
4. If draft is not saving, check if you have sufficient storage

**Technical Details**:
- Recipient field requires comma-separated usernames
- Empty drafts are automatically deleted

### Draft Not Saving

**Issue**: Email draft is not being saved.

**Solutions**:
1. Ensure at least one field has content (to, subject, or body)
2. Check your device storage space
3. Make sure app has proper permissions

## Label Management Issues

### Cannot Create Label

**Issue**: Unable to create a new label.

**Solutions**:
1. Ensure you're providing a unique label name
2. Check your internet connection
3. Verify you're not exceeding any label limits
4. Try restarting the app

### Labels Not Syncing

**Issue**: Custom labels are not appearing or updating.

**Solutions**:
1. Pull down to refresh the interface
2. Check your internet connection
3. Sign out and sign back in
4. Clear app data as a last resort

## Interface Issues

### Dark Mode Not Working

**Issue**: Unable to toggle or apply dark mode.

**Solutions**:
1. Check if your device supports theme changes
2. Try restarting the app after changing the setting
3. Update to the latest app version
4. Clear app preferences:
   - Settings > Apps > Gmail Project > Storage > Clear Data
   - Note: This will reset all your app settings

**Technical Details**:
- Dark mode preference is stored in SharedPreferences with key "dark_mode"
- The app uses AppCompatDelegate.setDefaultNightMode() to apply themes

### Profile Photo Not Displaying

**Issue**: Profile photo not showing or not updating.

**Solutions**:
1. Check if the image was properly uploaded during registration
2. Try uploading a smaller image file
3. Ensure the app has camera and storage permissions
4. Sign out and sign back in

**Technical Details**:
- Profile images are stored as Base64 strings
- The app uses Glide for image rendering with circleCrop transformation

## Search Functionality Issues

### Search Not Working

**Issue**: Search results are incorrect or not showing.

**Solutions**:
1. Try different search terms
2. Ensure you have internet connection for complete search
3. Clear search and try again
4. Pull down to refresh after search

**Technical Details**:
- Search queries the server API
- Empty search queries revert to showing the current label contents

## Offline Functionality Issues

### Changes Not Syncing

**Issue**: Changes made offline are not syncing when back online.

**Solutions**:
1. Manually pull down to refresh when connection is restored
2. Check that you have a stable internet connection
3. If still not syncing, restart the app
4. As a last resort, clear app data

## Permission Issues

### Camera Permission Denied

**Issue**: Unable to take profile photos.

**Solutions**:
1. Grant camera permission when prompted
2. If previously denied:
   - Go to Settings > Apps > Gmail Project > Permissions
   - Enable Camera permission
3. Use gallery option instead to select an existing photo

### Storage Permission Denied

**Issue**: Cannot access gallery for profile photos.

**Solutions**:
1. Grant storage permission when prompted
2. If previously denied:
   - Go to Settings > Apps > Gmail Project > Permissions
   - Enable Storage permission
3. Use camera option instead to take a new photo

## Network Issues

### Server Connection Errors

**Issue**: Unable to connect to server.

**Solutions**:
1. Check your internet connection
2. Verify the server is running and accessible
3. Try using mobile data instead of Wi-Fi (or vice versa)
4. If persistent, contact system administrator

**Technical Details**:
- The app connects to the API server using Retrofit
- Connection issues often result in onFailure callbacks with error messages

### Slow Performance

**Issue**: App is slow or unresponsive.

**Solutions**:
1. Check your internet connection speed
2. Ensure you have sufficient device storage
3. Close other apps running in the background
4. Restart your device
5. Clear app cache:
   - Settings > Apps > Gmail Project > Storage > Clear Cache

## Complete App Reset

If all else fails and you're experiencing persistent issues:

1. Go to Settings > Apps > Gmail Project > Storage > Clear Data
2. Uninstall and reinstall the app
3. Sign in again with your credentials

**Note**: This will remove all cached data and reset all app