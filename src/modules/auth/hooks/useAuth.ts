import { useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/modules/config/firebase'
import { useUserStore } from '@/modules/store'
import { signInAnonymously, sendPasswordlessEmail } from '@/lib/firebase/auth'
import type { AuthUser, AuthState } from '../types'

/**
 * Authentication hook
 * 
 * Manages Firebase authentication state and provides authentication methods.
 * Automatically signs in anonymously if no user is authenticated.
 * Syncs user state with Zustand store.
 * 
 * @returns Authentication state and methods
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const { setUser, clearUser } = useUserStore()

  /**
   * Sync user state to Zustand store
   */
  const syncUserToStore = useCallback(
    (user: AuthUser | null) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
          role: user.role ?? null,
          displayName: user.displayName,
        })
      } else {
        clearUser()
      }
    },
    [setUser, clearUser]
  )

  /**
   * Sign in anonymously
   */
  const handleSignInAnonymously = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      await signInAnonymously()
      // Auth state will be updated via onAuthStateChanged
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign in anonymously')
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }, [])

  /**
   * Sign out
   */
  const handleSignOut = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      await firebaseSignOut(auth)
      // Auth state will be updated via onAuthStateChanged
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign out')
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }, [])

  /**
   * Send magic link email
   */
  const handleSendMagicLink = useCallback(async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }))
      await sendPasswordlessEmail(email)
    } catch (error) {
      const authError =
        error instanceof Error ? error : new Error('Failed to send magic link')
      setAuthState((prev) => ({
        ...prev,
        error: authError,
      }))
      throw authError
    }
  }, [])

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          const authUser: AuthUser = {
            ...firebaseUser,
            // Extract role from custom claims if available
            role: (firebaseUser as AuthUser).role,
          }
          setAuthState({
            user: authUser,
            loading: false,
            error: null,
          })
          syncUserToStore(authUser)
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          })
          syncUserToStore(null)
          // Auto-sign in anonymously if no user
          handleSignInAnonymously().catch(() => {
            // Error already handled in handleSignInAnonymously
          })
        }
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Auth state error'),
        })
        syncUserToStore(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [syncUserToStore, handleSignInAnonymously])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signInAnonymously: handleSignInAnonymously,
    signOut: handleSignOut,
    sendMagicLink: handleSendMagicLink,
  }
}

