# Android App Installation and Usage Guide

This guide helps you set up and use the Gmail Project Android application.

## Installation Setup

### Getting Android Studio

1. Download and install Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Complete the setup wizard, installing all recommended components:
   - Android SDK
   - Android SDK Platform-Tools
   - Android Emulator
   - Android SDK Platform (7.0 or higher)

### Getting the App

1. Clone or download the project:
   ```
   git clone https://github.com/danieljenudi/GMAIL_PROJECT_D.T.H.git
   ```
2. Open Android Studio
3. Select "Open an Existing Project" and navigate to the Android app folder
4. Wait for Gradle to sync

## Launching the App

### Using an Emulator

1. In Android Studio, click on "AVD Manager" in the toolbar
2. Click "Create Virtual Device"
3. Select a device (like Pixel 4) and click "Next"
4. Choose Android 7.0 or higher and click "Next"
5. Give it a name and click "Finish"
6. Select your emulator from the dropdown and click the green "Run" button
7. The app will open automatically once installed

### Using Your Own Android Device

1. Enable Developer Options on your phone:
   - Go to Settings > About Phone
   - Tap "Build Number" seven times until you see "You are now a developer"
2. Go back to Settings and find Developer Options
3. Enable USB Debugging
4. Connect your phone to your computer with a USB cable
5. Allow the debugging permission on your phone
6. Select your device in Android Studio and click the green "Run" button

## Next Steps

Now that you've successfully installed the Android app, you can learn how to use it:

- [Android Getting Started Guide](../Android-User-Guide/Getting-Started.md) - Learn how to use the app's features including email management, label organization, and more.
