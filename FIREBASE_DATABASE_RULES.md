# Firebase Realtime Database Security Rules

This document provides the security rules for your Firebase Realtime Database. These rules control who can read and write data.

## Current Rules (Copy and paste into Firebase Console)

Go to **Firebase Console** > **Realtime Database** > **Rules** and replace the existing rules with:

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

## Rule Explanations

### Products
- **Read**: Anyone can read products (public catalog)
- **Write**: Only authenticated admins can write products

### Orders
- **Read**: 
  - Users can read their own orders (`data.child('userId').val() == auth.uid`)
  - Admins can read any order
  - General read access for authenticated users (to list orders)
- **Write**:
  - Users can create new orders (`!data.exists()` means the order doesn't exist yet)
  - Users can update their own orders (`data.child('userId').val() == auth.uid`)
  - Admins can update any order

### User Checkout Details
- **Read/Write**: Users can only access their own checkout details

### Admins
- **Read**: Only admins can read the admins list
- **Write**: No one can write to admins (must be done manually in Firebase Console)

## Alternative Rules (More Restrictive)

If you want stricter rules, use this version:

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
      }
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

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Realtime Database** > **Rules**
4. Copy and paste the rules above
5. Click **Publish**

## Testing Rules

After applying the rules, test by:
1. Signing in as a regular user
2. Adding items to cart and checking out
3. Verifying the order is saved successfully
4. Checking that you can view your orders

## Troubleshooting

### "Permission denied" error when creating orders
- **Solution**: Make sure the rules allow authenticated users to write to `/orders`
- Check that `auth != null` is true (user is signed in)
- Verify the rule `!data.exists()` allows creating new orders

### "Permission denied" when reading orders
- **Solution**: Ensure the user is authenticated
- Check that the order's `userId` matches `auth.uid`
- Verify admin status if trying to read all orders

### Rules not taking effect
- **Solution**: 
  - Click **Publish** after making changes
  - Wait a few seconds for rules to propagate
  - Clear browser cache and refresh
  - Check that you're using the correct Firebase project

## Development vs Production

For **development**, you can use more permissive rules (but still require authentication):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

⚠️ **Warning**: Never use these rules in production! They allow any authenticated user to read/write all data.

## Security Best Practices

1. **Always require authentication** for write operations
2. **Validate data structure** on the client side before writing
3. **Use server-side validation** for critical operations in production
4. **Regularly audit** who has admin access
5. **Monitor** database access logs for suspicious activity
6. **Keep rules simple** - complex rules are harder to debug and maintain

