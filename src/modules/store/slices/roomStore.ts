import type { StateCreator } from 'zustand'
import type { RoomSlice, RoomState } from '../types'

/**
 * Initial room state
 */
const initialState: RoomState = {
  currentRoomId: null,
  isInRoom: false,
}

/**
 * Room store slice
 * 
 * Manages current room state (client-side only).
 * Note: Room data (phase, participants, etc.) comes from Firestore.
 * This slice only tracks which room the user is currently in.
 */
export const createRoomSlice: StateCreator<RoomSlice> = (set) => ({
  room: initialState,
  setCurrentRoom: (roomId) =>
    set({
      room: {
        currentRoomId: roomId,
        isInRoom: roomId !== null,
      },
    }),
  clearRoom: () =>
    set({
      room: initialState,
    }),
})

