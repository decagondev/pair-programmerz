import { useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/modules/config/firebase'
import { useAppStore } from '@/modules/store'
import { sendPasswordlessEmail, signInWithGoogle } from '@/lib/firebase/auth'
import type { AuthUser, AuthState } from '../types'

/**
 * Authentication hook
 * 
 * Manages Firebase authentication state and provides authentication methods.
 * Users must sign in with Google to access the application.
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
  // Get store methods directly to avoid dependency issues
  const setUser = useAppStore((state) => state.setUser)
  const clearUser = useAppStore((state) => state.clearUser)

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

  /**
   * Sign in with Google
   */
  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      await signInWithGoogle()
      // Auth state will be updated via onAuthStateChanged
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign in with Google')
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }, [])

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!isMounted) return

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
          // No auto sign-in - user must sign in with Google
        }
      },
      (error) => {
        if (!isMounted) return
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Auth state error'),
        })
        syncUserToStore(null)
      }
    )

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [syncUserToStore])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    sendMagicLink: handleSendMagicLink,
  }
}

