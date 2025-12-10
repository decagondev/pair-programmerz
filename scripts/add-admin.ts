/**
 * Script to add an admin user to Firestore
 * 
 * Usage:
 *   npx tsx scripts/add-admin.ts <user-email>
 * 
 * Example:
 *   npx tsx scripts/add-admin.ts tomtarpeydev@gmail.com
 * 
 * This script uses Firebase Admin SDK to add a user to the admins collection.
 * The user must exist in Firebase Authentication first.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  if (!serviceAccountPath) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_PATH environment variable is required.\n' +
      'Download your service account key from Firebase Console:\n' +
      '1. Go to Project Settings > Service Accounts\n' +
      '2. Click "Generate new private key"\n' +
      '3. Save the JSON file\n' +
      '4. Set FIREBASE_SERVICE_ACCOUNT_PATH to the path of that file'
    )
  }

  const serviceAccount = require(serviceAccountPath)

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || serviceAccount.project_id,
  })
}

/**
 * Get user by email
 */
async function getUserByEmail(email: string) {
  const auth = getAuth()
  try {
    const user = await auth.getUserByEmail(email)
    return user
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error(
        `User with email ${email} not found in Firebase Authentication.\n` +
        'Please make sure the user has signed in at least once.'
      )
    }
    throw error
  }
}

/**
 * Add user as admin
 */
async function addAdmin(userId: string, email: string) {
  const db = getFirestore()
  const adminRef = db.collection('admins').doc(userId)

  // Check if already admin
  const adminDoc = await adminRef.get()
  if (adminDoc.exists) {
    console.log(`✅ User ${email} is already an admin!`)
    return
  }

  // Add admin document
  await adminRef.set({
    email,
    createdAt: new Date(),
    addedBy: 'script',
  })

  console.log(`✅ Successfully added ${email} as admin!`)
  console.log(`   User ID: ${userId}`)
}

/**
 * Main function
 */
async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Error: Email is required')
    console.log('')
    console.log('Usage:')
    console.log('  npx tsx scripts/add-admin.ts <user-email>')
    console.log('')
    console.log('Example:')
    console.log('  npx tsx scripts/add-admin.ts tomtarpeydev@gmail.com')
    process.exit(1)
  }

  try {
    console.log(`🔍 Looking up user: ${email}...`)
    initializeFirebaseAdmin()

    const user = await getUserByEmail(email)
    console.log(`✅ Found user: ${user.displayName || user.email}`)
    console.log(`   User ID: ${user.uid}`)

    console.log(`🔐 Adding as admin...`)
    await addAdmin(user.uid, email)

    console.log('')
    console.log('🎉 Done! The user can now access the admin dashboard at /admin/tasks')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()

