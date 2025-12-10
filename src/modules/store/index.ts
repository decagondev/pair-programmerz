import { useMemo } from 'react'
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
 * Returns user state and methods. Uses individual selectors and memoization to prevent re-render issues.
 * Zustand functions are stable, so we only memoize based on the user data.
 * 
 * @example
 * ```typescript
 * const { user, setUser, clearUser } = useUserStore()
 * ```
 */
export const useUserStore = () => {
  // Use individual selectors - Zustand automatically optimizes these
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const clearUser = useAppStore((state) => state.clearUser)
  
  // Memoize only based on user data - Zustand functions are stable
  // We need to include functions in the object but they won't cause re-renders
  return useMemo(
    () => ({ user, setUser, clearUser }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user] // Functions are stable, so we only depend on user data
  )
}

/**
 * Room store hook
 * 
 * Returns room state and methods. Uses individual selectors and memoization to prevent re-render issues.
 * Zustand functions are stable, so we only memoize based on the room data.
 * 
 * @example
 * ```typescript
 * const { room, setCurrentRoom, clearRoom } = useRoomStore()
 * ```
 */
export const useRoomStore = () => {
  // Use individual selectors - Zustand automatically optimizes these
  const room = useAppStore((state) => state.room)
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom)
  const clearRoom = useAppStore((state) => state.clearRoom)
  
  // Memoize only based on room data - Zustand functions are stable
  // We need to include functions in the object but they won't cause re-renders
  return useMemo(
    () => ({ room, setCurrentRoom, clearRoom }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [room] // Functions are stable, so we only depend on room data
  )
}

// Export types
export type { AppStore, UserSlice, RoomSlice, UserState, RoomState, UserRole } from './types'

