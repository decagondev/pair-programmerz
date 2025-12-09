import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/modules/config/firebase'
import type {
  RoomDocument,
  RoomDocumentWithId,
  CreateRoomInput,
  UpdateRoomInput,
} from '@/modules/room/types'

/**
 * Create a new room
 * 
 * Creates a room document in Firestore with initial state.
 * 
 * @param input - Room creation data
 * @returns The created room document with ID
 * @throws {Error} If room creation fails
 */
export async function createRoom(
  input: CreateRoomInput
): Promise<RoomDocumentWithId> {
  try {
    const now = serverTimestamp() as Timestamp
    const roomData: Omit<RoomDocument, 'createdAt' | 'updatedAt'> & {
      createdAt: Timestamp | ReturnType<typeof serverTimestamp>
      updatedAt: Timestamp | ReturnType<typeof serverTimestamp>
    } = {
      createdBy: input.createdBy,
      participants: [],
      taskId: input.taskId,
      phase: 'waiting',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    }

    const roomRef = await addDoc(collection(db, 'rooms'), roomData)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      throw new Error('Failed to create room: document not found after creation')
    }

    const data = roomSnap.data() as RoomDocument
    return {
      id: roomSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to create room: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get a room by ID
 * 
 * @param roomId - Room document ID
 * @returns Room document with ID, or null if not found
 * @throws {Error} If query fails
 */
export async function getRoom(
  roomId: string
): Promise<RoomDocumentWithId | null> {
  try {
    const roomRef = doc(db, 'rooms', roomId)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      return null
    }

    const data = roomSnap.data() as RoomDocument
    return {
      id: roomSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to get room: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Update a room
 * 
 * Updates room document fields. Automatically updates `updatedAt` timestamp.
 * 
 * @param roomId - Room document ID
 * @param input - Partial room data to update
 * @throws {Error} If update fails
 */
export async function updateRoom(
  roomId: string,
  input: UpdateRoomInput
): Promise<void> {
  try {
    const roomRef = doc(db, 'rooms', roomId)
    const updateData: Record<string, unknown> = {
      ...input,
      updatedAt: serverTimestamp(),
    }

    // Update status based on phase if phase is being updated
    if (input.phase !== undefined) {
      updateData.status = input.phase === 'ended' ? 'finished' : 'active'
      // If phaseStartedAt is not explicitly provided, set it to server timestamp
      // This ensures we track when the phase started for timer calculations
      if (input.phaseStartedAt === undefined) {
        updateData.phaseStartedAt = serverTimestamp()
      }
    }

    await updateDoc(roomRef, updateData)
  } catch (error) {
    throw new Error(
      `Failed to update room: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get all rooms for a user
 * 
 * Fetches all rooms where the user is either the creator or a participant.
 * 
 * @param userId - User ID
 * @returns Array of room documents with IDs
 * @throws {Error} If query fails
 */
export async function getUserRooms(
  userId: string
): Promise<RoomDocumentWithId[]> {
  try {
    const roomsRef = collection(db, 'rooms')
    const q = query(
      roomsRef,
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const rooms: RoomDocumentWithId[] = []

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as RoomDocument
      rooms.push({
        id: docSnap.id,
        ...data,
      })
    })

    return rooms
  } catch (error) {
    throw new Error(
      `Failed to get user rooms: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Subscribe to rooms for a user (real-time)
 * 
 * Sets up a real-time listener for rooms where the user is the creator.
 * Returns an unsubscribe function.
 * 
 * @param userId - User ID
 * @param callback - Callback function called with room updates
 * @returns Unsubscribe function
 */
export function subscribeToUserRooms(
  userId: string,
  callback: (rooms: RoomDocumentWithId[]) => void
): () => void {
  const roomsRef = collection(db, 'rooms')
  const q = query(
    roomsRef,
    where('createdBy', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(
    q,
    (querySnapshot) => {
      const rooms: RoomDocumentWithId[] = []

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as RoomDocument
        rooms.push({
          id: docSnap.id,
          ...data,
        })
      })

      callback(rooms)
    },
    (error) => {
      console.error('Error in rooms subscription:', error)
      callback([])
    }
  )
}

/**
 * Subscribe to a single room (real-time)
 * 
 * Sets up a real-time listener for a specific room.
 * Returns an unsubscribe function.
 * 
 * @param roomId - Room document ID
 * @param callback - Callback function called with room updates
 * @returns Unsubscribe function
 */
export function subscribeToRoom(
  roomId: string,
  callback: (room: RoomDocumentWithId | null) => void
): () => void {
  const roomRef = doc(db, 'rooms', roomId)

  return onSnapshot(
    roomRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null)
        return
      }

      const data = docSnap.data() as RoomDocument
      callback({
        id: docSnap.id,
        ...data,
      })
    },
    (error) => {
      console.error('Error in room subscription:', error)
      callback(null)
    }
  )
}

