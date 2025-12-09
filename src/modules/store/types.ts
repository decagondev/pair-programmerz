/**
 * Store type definitions
 * 
 * This file contains TypeScript types for the Zustand store and its slices.
 */

/**
 * User role type
 */
export type UserRole = 'interviewer' | 'candidate'

/**
 * User state interface
 */
export interface UserState {
  id: string | null
  email: string | null
  role: UserRole | null
  displayName: string | null
}

/**
 * User store slice interface
 */
export interface UserSlice {
  user: UserState
  setUser: (user: Partial<UserState>) => void
  clearUser: () => void
}

/**
 * Room state interface
 */
export interface RoomState {
  currentRoomId: string | null
  isInRoom: boolean
}

/**
 * Room store slice interface
 */
export interface RoomSlice {
  room: RoomState
  setCurrentRoom: (roomId: string | null) => void
  clearRoom: () => void
}

/**
 * Combined store type
 */
export interface AppStore extends UserSlice, RoomSlice {}

