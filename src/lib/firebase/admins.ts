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

