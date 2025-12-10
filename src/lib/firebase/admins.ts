import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/modules/config/firebase'

/**
 * Check if user is admin
 * 
 * Checks if a user document exists in the admins collection.
 * 
 * @param userId - User ID to check
 * @returns True if user is admin, false otherwise
 * @throws {Error} If query fails
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminRef = doc(db, 'admins', userId)
    const adminSnap = await getDoc(adminRef)
    return adminSnap.exists()
  } catch (error) {
    throw new Error(
      `Failed to check admin status: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Setup admin utility functions for browser console
 * 
 * Provides helper functions accessible from browser console:
 * - window.getMyUID() - Get current user's UID
 * - window.getMyAdminInfo() - Get current user's admin status and info
 * 
 * These are useful for setting up the first admin user.
 */
export function setupAdminUtilities() {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window for console access
    window.getMyUID = async () => {
      try {
        const { getAuth } = await import('firebase/auth')
        const { auth } = await import('@/modules/config/firebase')
        const authInstance = getAuth(auth.app)
        const user = authInstance.currentUser

        if (!user) {
          console.error('❌ You must be signed in first!')
          console.log('💡 Sign in with Google, then run this command again.')
          return null
        }

        console.log('✅ Your User Information:')
        console.log('   UID:', user.uid)
        console.log('   Email:', user.email)
        console.log('   Display Name:', user.displayName)
        console.log('')
        console.log('📋 To make yourself an admin:')
        console.log('   1. Go to Firebase Console: https://console.firebase.google.com/')
        console.log('   2. Select your project')
        console.log('   3. Go to Firestore Database')
        console.log('   4. Click "Start collection" (if admins collection doesn\'t exist)')
        console.log('   5. Collection ID: "admins"')
        console.log('   6. Document ID: "' + user.uid + '"')
        console.log('   7. Add a field (optional):')
        console.log('      - Field: "email"')
        console.log('      - Type: string')
        console.log('      - Value: "' + user.email + '"')
        console.log('   8. Click "Save"')
        console.log('   9. Refresh this page and navigate to /admin/tasks')
        console.log('')
        console.log('🔗 Direct link to Firestore:')
        console.log(`   https://console.firebase.google.com/project/${auth.app.options.projectId}/firestore/data/~2Fadmins~2F${user.uid}`)

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }
      } catch (error) {
        console.error('Failed to get user info:', error)
        throw error
      }
    }

    // @ts-ignore
    window.getMyAdminInfo = async () => {
      try {
        const { getAuth } = await import('firebase/auth')
        const { auth } = await import('@/modules/config/firebase')
        const authInstance = getAuth(auth.app)
        const user = authInstance.currentUser

        if (!user) {
          console.error('❌ You must be signed in first!')
          return null
        }

        const adminStatus = await isAdmin(user.uid)

        console.log('👤 User Information:')
        console.log('   UID:', user.uid)
        console.log('   Email:', user.email)
        console.log('   Display Name:', user.displayName)
        console.log('')
        console.log('🔐 Admin Status:', adminStatus ? '✅ YES (You are an admin!)' : '❌ NO')
        console.log('')

        if (!adminStatus) {
          console.log('📋 To make yourself an admin, run: window.getMyUID()')
        } else {
          console.log('✅ You have admin access!')
          console.log('🔗 Admin dashboard: /admin/tasks')
        }

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAdmin: adminStatus,
        }
      } catch (error) {
        console.error('Failed to get admin info:', error)
        throw error
      }
    }

    console.log('✅ Admin utilities loaded!')
    console.log('💡 Run window.getMyUID() to get your user ID for admin setup')
    console.log('💡 Run window.getMyAdminInfo() to check your admin status')
  }
}

