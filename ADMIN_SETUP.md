# Admin Login Setup Guide

This guide will help you set up Firebase authentication for admin login so you can create custom email and password credentials.

## Step 1: Enable Email/Password Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Email/Password**
5. Enable the first toggle (Email/Password) and click **Save**
6. Optionally enable "Email link (passwordless sign-in)" if you want, but it's not required

## Step 2: Create Your Admin User Account

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user** button
3. Enter your admin email address (e.g., `admin@yourdomain.com`)
4. Enter a secure password (at least 6 characters)
5. Click **Add user**

**Important**: Save the email and password you just created - you'll use these to log in to the admin dashboard.

## Step 3: Get the User UID

1. After creating the user, you'll see them in the Users list
2. Click on the user to view details
3. Copy the **User UID** (it's a long string like `abc123xyz789...`)

## Step 4: Add Admin to Realtime Database

You need to add this user to the `admins` collection in Realtime Database so the system recognizes them as an admin.

### Option A: Using Firebase Console (Recommended)

1. Go to **Realtime Database** > **Data** in Firebase Console
2. If you don't see an `admins` node, create it:
   - Click the **+** button at the root level
   - Name it `admins` and press Enter
3. Under `admins`, click **+** to add a new child
4. Use the User UID as the key (paste the UID you copied in Step 3)
5. Add the following fields:
   - Click **+** next to the UID
   - Add field: `email` with value: your admin email (e.g., `admin@yourdomain.com`)
   - Add field: `createdAt` with value: current timestamp (e.g., `2024-01-01T00:00:00Z`)

**Example structure:**
```
admins
  └── [USER_UID]
      ├── email: "admin@yourdomain.com"
      └── createdAt: "2024-01-01T00:00:00Z"
```

### Option B: Using Firebase CLI (Advanced)

If you have Firebase CLI installed, you can use:

```bash
firebase database:set /admins/[USER_UID] '{"email":"admin@yourdomain.com","createdAt":"2024-01-01T00:00:00Z"}' --project your-project-id
```

## Step 5: Set Up Realtime Database Security Rules

1. Go to **Realtime Database** > **Rules** in Firebase Console
2. Update your rules to include admin checking:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "orders": {
      "$orderId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('admins').child(auth.uid).exists())",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || root.child('admins').child(auth.uid).exists() || !data.exists())"
      },
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "userCheckoutDetails": {
      "$userId": {
        ".read": "auth != null && $userId == auth.uid",
        ".write": "auth != null && $userId == auth.uid"
      }
    },
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".write": false
    }
  }
}
```

3. Click **Publish** to save the rules

## Step 6: Test Admin Login

1. Go to your application's admin login page: `/admin/login`
2. Enter the email and password you created in Step 2
3. Click **Sign In**
4. You should be redirected to `/admin/dashboard`

## Troubleshooting

### "Access denied. This account is not authorized as an admin."
- Make sure you added the user to the `admins` node in Realtime Database
- Verify the UID in the database matches the user's UID exactly
- Check that the `admins` node structure is correct

### "No account found with this email address."
- Verify the email is correct
- Make sure Email/Password authentication is enabled in Firebase
- Check that you created the user in Firebase Authentication

### "Incorrect password."
- Double-check the password you're entering
- If you forgot the password, you can reset it in Firebase Console > Authentication > Users

### "Firebase Auth is not configured"
- Check your `.env` file has all required Firebase variables
- Make sure `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_AUTH_DOMAIN` are set
- Restart your dev server after updating `.env`

## Adding More Admin Users

To add additional admin users:

1. Create a new user in Firebase Authentication (Step 2)
2. Get their UID (Step 3)
3. Add them to the `admins` node in Realtime Database (Step 4)

You can also add admins by email instead of UID - the system checks both methods.

## Security Best Practices

1. **Use strong passwords**: At least 12 characters with mix of letters, numbers, and symbols
2. **Limit admin accounts**: Only create admin accounts for trusted personnel
3. **Regular audits**: Periodically review who has admin access
4. **Enable 2FA**: Consider enabling two-factor authentication for admin accounts (requires additional Firebase setup)
5. **Production rules**: Update security rules for production to be more restrictive

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify all Firebase services are enabled
3. Ensure your `.env` file is correctly configured
4. Make sure you restarted the dev server after any `.env` changes

