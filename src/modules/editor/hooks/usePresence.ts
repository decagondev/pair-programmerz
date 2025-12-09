import { useSelf, useOthers, useUpdateMyPresence } from '@liveblocks/react'
import type { EditorPresence } from '../types'

/**
 * Presence hook for editor
 * 
 * Provides access to presence data for the current user and other participants.
 * 
 * @returns Presence data and update function
 */
export function usePresence() {
  const self = useSelf()
  const others = useOthers((others) => others)
  const updateMyPresence = useUpdateMyPresence()

  /**
   * Update current user's presence
   */
  const updatePresence = (presence: Partial<EditorPresence>) => {
    updateMyPresence(presence as any)
  }

  return {
    self: self ? (self.presence as unknown as EditorPresence) : null,
    others: others.map((other) => ({
      ...(other.presence as unknown as EditorPresence),
      connectionId: other.connectionId,
    })),
    updatePresence,
  }
}

