import { useStorage, useMutation } from '@liveblocks/react'
import { useAuth } from '@/modules/auth'
import { useRole } from '@/modules/auth/hooks/useRole'

/**
 * Driver management hook
 * 
 * Manages driver/navigator role switching in the editor.
 * Driver ID is stored in Liveblocks storage for real-time synchronization.
 * 
 * @param roomId - Firestore room ID (for role detection)
 * @returns Driver state and control functions
 */
export function useDriver(roomId: string | null) {
  const { user } = useAuth()
  const { role } = useRole(roomId)

  // Get current driver ID from Liveblocks storage
  const driverId = useStorage((root) => (root as { driverId?: string | null }).driverId ?? null)

  // Check if current user is the driver
  const isDriver = driverId === user?.uid

  // Check if user is interviewer (can always take control)
  const isInterviewer = role === 'interviewer'

  // Mutation to update driver ID
  const updateDriver = useMutation(({ storage }, newDriverId: string | null) => {
    storage.set('driverId', newDriverId)
  }, [])

  /**
   * Request control (become driver)
   */
  const requestControl = () => {
    if (user?.uid) {
      updateDriver(user.uid)
    }
  }

  /**
   * Release control (stop being driver)
   */
  const releaseControl = () => {
    if (isDriver) {
      updateDriver(null)
    }
  }

  /**
   * Take control (interviewer can force take control)
   */
  const takeControl = () => {
    if (isInterviewer && user?.uid) {
      updateDriver(user.uid)
    }
  }

  return {
    driverId,
    isDriver,
    isInterviewer,
    requestControl,
    releaseControl,
    takeControl,
  }
}

