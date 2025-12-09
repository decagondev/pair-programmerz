import { create } from 'zustand'
import { createStoreWithMiddleware } from './middleware'
import { createUserSlice } from './slices/userStore'
import { createRoomSlice } from './slices/roomStore'
import type { AppStore } from './types'

/**
 * Main application store
 * 
 * This is the root Zustand store that combines all store slices.
 * The store is configured with:
 * - DevTools integration (development only)
 * - LocalStorage persistence (user preferences only)
 * 
 * @example
 * ```typescript
 * import { useAppStore } from '@/modules/store'
 * const user = useAppStore((state) => state.user)
 * ```
 */
export const useAppStore = create<AppStore>()(
  createStoreWithMiddleware((...args) => ({
    ...createUserSlice(...args),
    ...createRoomSlice(...args),
  }))
)

/**
 * Convenience hooks for specific store slices
 * 
 * These hooks provide type-safe access to specific parts of the store.
 */

/**
 * User store hook
 * 
 * @example
 * ```typescript
 * const { user, setUser, clearUser } = useUserStore()
 * ```
 */
export const useUserStore = () => useAppStore((state) => ({
  user: state.user,
  setUser: state.setUser,
  clearUser: state.clearUser,
}))

/**
 * Room store hook
 * 
 * @example
 * ```typescript
 * const { room, setCurrentRoom, clearRoom } = useRoomStore()
 * ```
 */
export const useRoomStore = () => useAppStore((state) => ({
  room: state.room,
  setCurrentRoom: state.setCurrentRoom,
  clearRoom: state.clearRoom,
}))

// Export types
export type { AppStore, UserSlice, RoomSlice, UserState, RoomState, UserRole } from './types'

