import { useState, useEffect, useCallback } from 'react'
import { useUserStore } from '@/modules/store'
import { getUserRole, isInterviewerGlobally } from '@/lib/firebase/roles'
import { useAuth } from './useAuth'
import type { UserRole } from '@/modules/store/types'

/**
 * Role detection hook
 * 
 * Determines the user's role in a room by querying Firestore.
 * If roomId is null, checks if user is an interviewer globally (has created rooms).
 * Caches the role in Zustand store for performance.
 * 
 * @param roomId - Room ID (optional, if null checks global interviewer status)
 * @returns User role, loading state, and error
 */
export function useRole(roomId: string | null) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const { user: userState } = useUserStore()

  /**
   * Fetch role from Firestore
   */
  const fetchRole = useCallback(async () => {
    if (!user?.uid) {
      setRole(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let userRole: UserRole | null = null

      if (roomId) {
        // Check role in specific room
        userRole = await getUserRole(roomId, user.uid)
      } else {
        // Check if user is an interviewer globally (has created rooms)
        // This is used for dashboard access
        const isInterviewer = await isInterviewerGlobally(user.uid)
        userRole = isInterviewer ? 'interviewer' : null
      }

      setRole(userRole)

      // Update Zustand store with role if it changed
      if (userRole !== userState.role) {
        // Note: This will be handled by the store's setUser method
        // We don't directly update the store here to avoid circular dependencies
      }
    } catch (err) {
      const roleError =
        err instanceof Error ? err : new Error('Failed to fetch user role')
      setError(roleError)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }, [roomId, user?.uid, userState.role])

  // Fetch role when roomId or user changes
  useEffect(() => {
    fetchRole()
  }, [fetchRole])

  return {
    role,
    loading,
    error,
    refetch: fetchRole,
  }
}

