import { useState, useEffect, useCallback } from 'react'
import { useStorage, useMutation } from '@liveblocks/react'
import { useAuth } from '@/modules/auth'

/**
 * Raise hand hook
 * 
 * Manages raised hands stored in Liveblocks storage.
 * Tracks which users have raised their hands.
 * 
 * @param roomId - Room ID (for Liveblocks room context)
 * @returns Raised hands state and toggle function
 */
export function useRaiseHand(roomId: string | null) {
  const { user } = useAuth()
  const raisedHands = useStorage((root) => {
    const storage = root as { raisedHands?: string[] }
    return storage.raisedHands || []
  })

  const [localRaisedHands, setLocalRaisedHands] = useState<string[]>([])

  // Sync with Liveblocks storage
  useEffect(() => {
    if (raisedHands) {
      setLocalRaisedHands(raisedHands)
    }
  }, [raisedHands])

  // Mutation to update raised hands in Liveblocks storage
  const updateRaisedHands = useMutation(
    ({ storage }, newRaisedHands: string[]) => {
      storage.set('raisedHands', newRaisedHands)
    },
    []
  )

  /**
   * Check if current user has raised hand
   */
  const isRaised = user?.uid ? localRaisedHands.includes(user.uid) : false

  /**
   * Toggle raise hand
   */
  const toggleRaiseHand = useCallback(() => {
    if (!user?.uid || !roomId) return

    let updatedRaisedHands: string[]
    if (isRaised) {
      // Lower hand
      updatedRaisedHands = localRaisedHands.filter((uid) => uid !== user.uid)
    } else {
      // Raise hand
      updatedRaisedHands = [...localRaisedHands, user.uid]
    }

    setLocalRaisedHands(updatedRaisedHands)
    updateRaisedHands(updatedRaisedHands)
  }, [user?.uid, roomId, isRaised, localRaisedHands, updateRaisedHands])

  return {
    raisedHands: localRaisedHands,
    isRaised,
    toggleRaiseHand,
  }
}

