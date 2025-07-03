# Account Management

This guide covers how to manage your account settings in the Gmail Project.

## Sign Up

Creating a new account:

1. Navigate to the Welcome Page (`http://localhost:3000`)
2. Click the "Sign Up" button
3. Fill in the required information:
   - User Name (unique identifier)
   - Password (secure password for your account)
   - Confirm Password (enter the same password again)
   - First Name
   - Last Name
   - Gender (male/female/other)
   - Birth Date
   - Profile Image
4. Click "Sign Up" to create your account
5. You'll receive a confirmation message when your account is created
6. You'll be redirected to the Sign In page automatically

## Sign In

Accessing your account:

1. Navigate to the Welcome Page (`http://localhost:3000`)
2. Click the "Sign In" button
3. Enter your credentials:
   - User Name
   - Password
4. Click "Sign In"
5. Upon successful authentication, you'll be redirected to your inbox

## Profile Management

### Viewing Your Profile

1. Click on your profile picture in the top-right corner
2. Your profile information will be displayed, including:
   - User Name
   - First Name
   - Last Name
   - Gender
   - Birth Date
   - Profile Picture

## Security

### Password Management

- Use a strong, unique password for your account
- Keep your password confidential and do not share it with others
- There is currently no password reset functionality in this version of the application

### Session Management

- To log out of your account, Click the "Log Out" button located in the top navigation bar
- Your session will be terminated and you'll be redirected to the Welcome Page

## Privacy

The Gmail Project takes your privacy seriously:

- Emails are stored securely in the database
- User credentials are protected
- The application uses authentication tokens for secure API communication

## Important Notes

- This version of the Gmail Project is a demonstration application
- Some advanced account management features (like password reset) are not implemented
- For security reasons, always log out when using shared computers
- Clear your browser cache periodically to remove stored tokens