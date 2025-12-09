import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/modules/config/firebase'
import type { UserRole } from '@/modules/store/types'
import type { RoomDocument } from '@/modules/room/types'

/**
 * Get user role in a room
 * 
 * Determines the user's role by checking:
 * 1. If user created the room → interviewer
 * 2. If user is in participants → candidate
 * 3. Otherwise → null (not a participant)
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @returns User role or null if not a participant
 * @throws {Error} If room document doesn't exist or query fails
 */
export async function getUserRole(
  roomId: string,
  userId: string
): Promise<UserRole | null> {
  try {
    const roomRef = doc(db, 'rooms', roomId)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      throw new Error(`Room ${roomId} does not exist`)
    }

    const roomData = roomSnap.data() as RoomDocument

    // Check if user is the creator (interviewer)
    if (roomData.createdBy === userId) {
      return 'interviewer'
    }

    // Check if user is in participants (candidate)
    if (roomData.participants?.includes(userId)) {
      return 'candidate'
    }

    // User is not a participant
    return null
  } catch (error) {
    throw new Error(
      `Failed to get user role: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Check if user is interviewer
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @returns True if user created the room
 */
export async function isInterviewer(roomId: string, userId: string): Promise<boolean> {
  try {
    const role = await getUserRole(roomId, userId)
    return role === 'interviewer'
  } catch {
    return false
  }
}

/**
 * Check if user is candidate
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @returns True if user is in participants
 */
export async function isCandidate(roomId: string, userId: string): Promise<boolean> {
  try {
    const role = await getUserRole(roomId, userId)
    return role === 'candidate'
  } catch {
    return false
  }
}

