import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { subscribeToRoom } from '@/lib/firebase/rooms'
import type { RoomDocumentWithId } from '../types'

/**
 * Hook to fetch a single room by ID
 * 
 * Uses TanStack Query with real-time Firestore subscription.
 * Automatically updates when the room changes.
 * 
 * @param roomId - Room document ID
 * @returns Query result with room document
 */
export function useRoom(roomId: string) {
  const queryClient = useQueryClient()
  const [room, setRoom] = useState<RoomDocumentWithId | null>(null)

  // Set up real-time subscription
  useEffect(() => {
    if (!roomId) {
      setRoom(null)
      return
    }

    const unsubscribe = subscribeToRoom(roomId, (updatedRoom) => {
      setRoom(updatedRoom)
      // Update query cache
      queryClient.setQueryData(['room', roomId], updatedRoom)
    })

    return () => {
      unsubscribe()
    }
  }, [roomId, queryClient])

  // Use query for loading/error states
  const query = useQuery<RoomDocumentWithId | null>({
    queryKey: ['room', roomId],
    queryFn: () => room,
    enabled: !!roomId,
    initialData: room,
  })

  return {
    ...query,
    data: room ?? query.data ?? null,
  }
}

