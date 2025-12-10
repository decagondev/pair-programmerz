# Admin Setup Guide

This guide explains how to set up admin access for your account.

## Quick Method (Recommended)

### Step 1: Sign In to the Application

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Sign in with Google using your account: `tomtarpeydev@gmail.com`

### Step 2: Get Your User ID

1. Open the browser console (F12 or Cmd+Option+I)
2. You should see a message: "✅ Admin utilities loaded!"
3. Run this command:
   ```javascript
   window.getMyUID()
   ```
4. This will display:
   - Your User ID (UID)
   - Your email
   - Step-by-step instructions for adding yourself as admin

### Step 3: Add Yourself as Admin in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Start collection** (if the `admins` collection doesn't exist)
   - Collection ID: `admins`
5. Click **Add document**
   - Document ID: **Paste your UID** (from Step 2)
   - Add a field (optional but recommended):
     - Field: `email`
     - Type: `string`
     - Value: `tomtarpeydev@gmail.com`
6. Click **Save**

### Step 4: Verify Admin Access

1. Refresh your application
2. Navigate to `/admin/tasks` in your browser
3. You should now see the Admin Tasks page!

Alternatively, check your admin status in the console:
```javascript
window.getMyAdminInfo()
```

## Alternative Method: Using Firebase Console Directly

If you know your User ID already:

1. Go to Firebase Console > Firestore Database
2. Create collection `admins` (if it doesn't exist)
3. Add a document with:
   - Document ID: Your Firebase User UID
   - Fields (optional):
     - `email`: `tomtarpeydev@gmail.com`
     - `createdAt`: Current timestamp

## Finding Your User ID

If you need to find your User ID:

### Method 1: Browser Console (Easiest)
```javascript
window.getMyUID()
```

### Method 2: Firebase Console
1. Go to Firebase Console > Authentication
2. Find your user by email: `tomtarpeydev@gmail.com`
3. Copy the User UID

### Method 3: Application Code
After signing in, your UID is available in:
- Browser console: `window.getMyUID()`
- React DevTools: Check the auth state

## Troubleshooting

### "You don't have admin access"
- Make sure you created the document in the `admins` collection
- Verify the document ID matches your User UID exactly
- Refresh the page after creating the admin document
- Check the browser console for errors

### "Collection doesn't exist"
- Create the `admins` collection first
- Then add your user document

### "Permission denied"
- Make sure you're signed in to Firebase Console with the correct account
- Verify your Firestore security rules allow reading the admins collection

## Admin Features

Once you have admin access, you can:

- **Access Admin Dashboard**: Navigate to `/admin/tasks`
- **Manage Tasks**: Create, edit, and delete interview tasks
- **View All Tasks**: See all tasks in the system
- **Seed Sample Tasks**: Use the seed tasks utility (if available)

## Security Note

Admin access is controlled by Firestore security rules. Only users with a document in the `admins` collection can access admin features. The security rules prevent unauthorized writes to the admins collection, so admins must be added manually via Firebase Console.

