import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { env } from './env'

/**
 * Firebase configuration object
 */
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

/**
 * Initialize Firebase app
 * 
 * Returns existing app if already initialized, otherwise creates new app.
 * This prevents multiple Firebase app instances.
 */
function initializeFirebaseApp(): FirebaseApp {
  const existingApp = getApps()[0]
  if (existingApp) {
    return existingApp
  }
  return initializeApp(firebaseConfig)
}

/**
 * Firebase app instance
 * 
 * Use this for Firebase services initialization.
 */
export const firebaseApp = initializeFirebaseApp()

/**
 * Firebase Auth instance
 * 
 * Use this for authentication operations.
 */
export const auth: Auth = getAuth(firebaseApp)

/**
 * Firestore database instance
 * 
 * Use this for Firestore database operations.
 */
export const db: Firestore = getFirestore(firebaseApp)

