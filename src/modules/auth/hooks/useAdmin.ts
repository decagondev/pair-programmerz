import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { isAdmin } from '@/lib/firebase/admins'

/**
 * Admin check hook
 * 
 * Determines if the current user is an admin by querying Firestore.
 * 
 * @returns Admin status, loading state, and error
 */
export function useAdmin() {
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  /**
   * Fetch admin status from Firestore
   */
  const fetchAdminStatus = useCallback(async () => {
    if (!user?.uid) {
      setIsUserAdmin(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const adminStatus = await isAdmin(user.uid)
      setIsUserAdmin(adminStatus)
    } catch (err) {
      const adminError =
        err instanceof Error ? err : new Error('Failed to fetch admin status')
      setError(adminError)
      setIsUserAdmin(false)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  // Fetch admin status when user changes
  useEffect(() => {
    fetchAdminStatus()
  }, [fetchAdminStatus])

  return {
    isAdmin: isUserAdmin,
    loading,
    error,
    refetch: fetchAdminStatus,
  }
}

