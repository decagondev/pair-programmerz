import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/modules/config/firebase'
import type {
  ReflectionDocument,
  ReflectionDocumentWithId,
  CreateReflectionInput,
} from '@/modules/feedback/types'

/**
 * Get reflection for a user in a room
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @returns Reflection document with ID, or null if not found
 * @throws {Error} If query fails
 */
export async function getReflection(
  roomId: string,
  userId: string
): Promise<ReflectionDocumentWithId | null> {
  try {
    const reflectionRef = doc(db, 'rooms', roomId, 'reflections', userId)
    const reflectionSnap = await getDoc(reflectionRef)

    if (!reflectionSnap.exists()) {
      return null
    }

    const data = reflectionSnap.data() as ReflectionDocument
    return {
      id: reflectionSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to get reflection: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Create or update reflection
 * 
 * Creates a new reflection document or updates existing one.
 * Automatically sets timestamps.
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @param input - Reflection data
 * @throws {Error} If save fails
 */
export async function saveReflection(
  roomId: string,
  userId: string,
  input: CreateReflectionInput
): Promise<void> {
  try {
    const reflectionRef = doc(db, 'rooms', roomId, 'reflections', userId)
    const existingSnap = await getDoc(reflectionRef)

    const now = serverTimestamp() as Timestamp

    if (existingSnap.exists()) {
      // Update existing reflection
      await setDoc(
        reflectionRef,
        {
          ...input,
          updatedAt: now,
        },
        { merge: true }
      )
    } else {
      // Create new reflection
      const reflectionData: Omit<ReflectionDocument, 'createdAt' | 'updatedAt'> & {
        createdAt: Timestamp | ReturnType<typeof serverTimestamp>
        updatedAt: Timestamp | ReturnType<typeof serverTimestamp>
      } = {
        userId,
        roomId,
        responses: input.responses,
        createdAt: now,
        updatedAt: now,
      }

      await setDoc(reflectionRef, reflectionData)
    }
  } catch (error) {
    throw new Error(
      `Failed to save reflection: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Subscribe to reflection (real-time)
 * 
 * Sets up a real-time listener for a reflection document.
 * Returns an unsubscribe function.
 * 
 * @param roomId - Room ID
 * @param userId - User ID
 * @param callback - Callback function called with reflection updates
 * @returns Unsubscribe function
 */
export function subscribeToReflection(
  roomId: string,
  userId: string,
  callback: (reflection: ReflectionDocumentWithId | null) => void
): () => void {
  const reflectionRef = doc(db, 'rooms', roomId, 'reflections', userId)

  return onSnapshot(
    reflectionRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null)
        return
      }

      const data = docSnap.data() as ReflectionDocument
      callback({
        id: docSnap.id,
        ...data,
      })
    },
    (error) => {
      console.error('Error in reflection subscription:', error)
      callback(null)
    }
  )
}

