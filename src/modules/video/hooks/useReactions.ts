import { useState, useEffect, useCallback, useRef } from 'react'
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
  const lastReactionsRef = useRef<Reaction[]>([])

  // Mutation to update reactions in Liveblocks storage
  const updateReactions = useMutation(
    ({ storage }, newReactions: Reaction[]) => {
      storage.set('reactions', newReactions)
    },
    []
  )

  // Sync with Liveblocks storage (only if different to avoid loops)
  useEffect(() => {
    if (!reactions) {
      if (localReactions.length > 0) {
        setLocalReactions([])
        lastReactionsRef.current = []
      }
      return
    }

    // Deep comparison to avoid unnecessary updates
    const currentIds = reactions.map(r => r.id).join(',')
    const lastIds = lastReactionsRef.current.map(r => r.id).join(',')
    
    if (currentIds !== lastIds) {
      setLocalReactions(reactions)
      lastReactionsRef.current = reactions
    }
  }, [reactions, localReactions.length])

  // Cleanup old reactions (older than 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const filtered = localReactions.filter((reaction) => now - reaction.timestamp < 3000)

      // Only update if we actually removed reactions
      if (filtered.length !== localReactions.length) {
        setLocalReactions(filtered)
        // Update storage, but use a ref to avoid dependency issues
        updateReactions(filtered)
        lastReactionsRef.current = filtered
      }
    }, 500) // Check every 500ms

    return () => clearInterval(interval)
  }, [localReactions, updateReactions])

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

