import { devtools, persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { AppStore } from './types'

/**
 * Store middleware configuration
 * 
 * This function applies middleware to the store:
 * - devtools: Redux DevTools integration (development only)
 * - persist: LocalStorage persistence for user preferences
 * 
 * @param config - Store configuration function
 * @returns Configured store creator
 */
export function createStoreWithMiddleware<T extends AppStore>(
  config: StateCreator<T>
): StateCreator<T> {
  return devtools(
    persist(
      config,
      {
        name: 'paircode-store',
        // Only persist user preferences, not sensitive data
        partialize: (state) => ({
          user: {
            // Only persist non-sensitive user data
            displayName: state.user.displayName,
            // Don't persist auth tokens or sensitive info
          },
        }),
      }
    ),
    {
      name: 'PairCode Store',
      // Only enable in development
      enabled: import.meta.env.DEV,
    }
  ) as StateCreator<T>
}

