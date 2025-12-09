import type { StateCreator } from 'zustand'
import type { UserSlice, UserState } from '../types'

/**
 * Initial user state
 */
const initialState: UserState = {
  id: null,
  email: null,
  role: null,
  displayName: null,
}

/**
 * User store slice
 * 
 * Manages user authentication state and user preferences.
 * This slice handles:
 * - User ID, email, role, display name
 * - User preference updates
 * - User state clearing (logout)
 */
export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: initialState,
  setUser: (userData) =>
    set((state) => ({
      user: {
        ...state.user,
        ...userData,
      },
    })),
  clearUser: () =>
    set({
      user: initialState,
    }),
})

