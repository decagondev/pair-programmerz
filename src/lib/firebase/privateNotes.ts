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
  PrivateNotesDocument,
  PrivateNotesDocumentWithId,
  CreatePrivateNotesInput,
} from '@/modules/feedback/types'

/**
 * Get private notes for a user in a room
 * 
 * @param roomId - Room ID
 * @param userId - User ID (interviewer)
 * @returns Private notes document with ID, or null if not found
 * @throws {Error} If query fails
 */
export async function getPrivateNotes(
  roomId: string,
  userId: string
): Promise<PrivateNotesDocumentWithId | null> {
  try {
    const notesRef = doc(db, 'rooms', roomId, 'privateNotes', userId)
    const notesSnap = await getDoc(notesRef)

    if (!notesSnap.exists()) {
      return null
    }

    const data = notesSnap.data() as PrivateNotesDocument
    return {
      id: notesSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to get private notes: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Create or update private notes
 * 
 * Creates a new private notes document or updates existing one.
 * Automatically sets timestamps.
 * 
 * @param roomId - Room ID
 * @param userId - User ID (interviewer)
 * @param input - Private notes data
 * @throws {Error} If save fails
 */
export async function savePrivateNotes(
  roomId: string,
  userId: string,
  input: CreatePrivateNotesInput
): Promise<void> {
  try {
    const notesRef = doc(db, 'rooms', roomId, 'privateNotes', userId)
    const existingSnap = await getDoc(notesRef)

    const now = serverTimestamp() as Timestamp

    if (existingSnap.exists()) {
      // Update existing notes
      await setDoc(
        notesRef,
        {
          ...input,
          updatedAt: now,
        },
        { merge: true }
      )
    } else {
      // Create new notes
      const notesData: Omit<PrivateNotesDocument, 'createdAt' | 'updatedAt'> & {
        createdAt: Timestamp | ReturnType<typeof serverTimestamp>
        updatedAt: Timestamp | ReturnType<typeof serverTimestamp>
      } = {
        userId,
        roomId,
        content: input.content,
        createdAt: now,
        updatedAt: now,
      }

      await setDoc(notesRef, notesData)
    }
  } catch (error) {
    throw new Error(
      `Failed to save private notes: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Subscribe to private notes (real-time)
 * 
 * Sets up a real-time listener for a private notes document.
 * Returns an unsubscribe function.
 * 
 * @param roomId - Room ID
 * @param userId - User ID (interviewer)
 * @param callback - Callback function called with notes updates
 * @returns Unsubscribe function
 */
export function subscribeToPrivateNotes(
  roomId: string,
  userId: string,
  callback: (notes: PrivateNotesDocumentWithId | null) => void
): () => void {
  const notesRef = doc(db, 'rooms', roomId, 'privateNotes', userId)

  return onSnapshot(
    notesRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null)
        return
      }

      const data = docSnap.data() as PrivateNotesDocument
      callback({
        id: docSnap.id,
        ...data,
      })
    },
    (error) => {
      console.error('Error in private notes subscription:', error)
      callback(null)
    }
  )
}

