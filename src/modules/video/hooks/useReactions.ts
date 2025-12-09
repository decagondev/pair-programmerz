import { useState, useEffect, useCallback } from 'react'
import { useStorage, useMutation } from '@liveblocks/react'
import { useAuth } from '@/modules/auth'
import type { Reaction } from '../types'

/**
 * Reactions hook
 * 
 * Manages reactions stored in Liveblocks storage.
 * Reactions are automatically cleaned up after 3 seconds.
 * 
 * @param roomId - Room ID (for Liveblocks room context)
 * @returns Reactions state and trigger function
 */
export function useReactions(roomId: string | null) {
  const { user } = useAuth()
  const reactions = useStorage((root) => {
    const storage = root as { reactions?: Reaction[] }
    return storage.reactions || []
  })

  const [localReactions, setLocalReactions] = useState<Reaction[]>([])

  // Sync with Liveblocks storage
  useEffect(() => {
    if (reactions) {
      setLocalReactions(reactions)
    }
  }, [reactions])

  // Cleanup old reactions (older than 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const filtered = localReactions.filter((reaction) => now - reaction.timestamp < 3000)

      if (filtered.length !== localReactions.length) {
        updateReactions(filtered)
      }
    }, 500) // Check every 500ms

    return () => clearInterval(interval)
  }, [localReactions])

  // Mutation to update reactions in Liveblocks storage
  const updateReactions = useMutation(
    ({ storage }, newReactions: Reaction[]) => {
      storage.set('reactions', newReactions)
    },
    []
  )

  /**
   * Trigger a reaction
   */
  const triggerReaction = useCallback(
    (emoji: string) => {
      if (!user?.uid || !roomId) return

      const newReaction: Reaction = {
        userId: user.uid,
        emoji,
        timestamp: Date.now(),
        id: `${user.uid}-${Date.now()}-${Math.random()}`,
      }

      const updatedReactions = [...localReactions, newReaction]
      setLocalReactions(updatedReactions)
      updateReactions(updatedReactions)
    },
    [user?.uid, roomId, localReactions, updateReactions]
  )

  return {
    reactions: localReactions,
    triggerReaction,
  }
}

