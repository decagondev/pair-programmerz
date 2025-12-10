# Firebase Setup Guide

This guide will help you set up Firebase for the PairCode application.

## Prerequisites

- A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
- Your Firebase project configuration values

## Step 1: Enable Anonymous Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Find **Anonymous** in the list of providers
5. Click on it and **Enable** it
6. Click **Save**

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll update security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have a web app, click **Add app** > **Web** (</> icon)
4. Register your app with a nickname (e.g., "PairCode Web")
5. Copy the configuration values from the `firebaseConfig` object

## Step 4: Create Environment File

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with the rules from `firestore.rules` in your project
3. Click **Publish**

## Step 6: Set Up Cloud Functions (Optional, for production)

Cloud Functions are needed for:
- Magic link token generation
- Phase transition automation

To set up:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init functions`
4. Deploy: `firebase deploy --only functions`

## Step 7: Get Liveblocks Public Key

1. Go to [Liveblocks Dashboard](https://liveblocks.io/dashboard)
2. Sign up or log in
3. Create a new project or select an existing one
4. Copy your **Public Key**
5. Add it to your `.env` file:
   ```env
   VITE_LIVEBLOCKS_PUBLIC_KEY=your-liveblocks-public-key
   ```

## Step 8: Restart Your Dev Server

After setting up your `.env` file:
```bash
npm run dev
```

## Troubleshooting

### Error: "CONFIGURATION_NOT_FOUND"
- Make sure Anonymous Authentication is enabled in Firebase Console
- Verify your Firebase project ID matches in `.env` and Firebase Console

### Error: "Missing or invalid environment variables"
- Check that all required variables are in your `.env` file
- Make sure there are no typos in variable names
- Restart your dev server after updating `.env`

### Error: "Permission denied" in Firestore
- Check your Firestore security rules
- Make sure you've published the rules in Firebase Console

## Next Steps

Once Firebase is set up:
1. Test anonymous authentication (should work automatically)
2. Create a test room from the dashboard
3. Test the magic link flow (requires Cloud Functions for production)

