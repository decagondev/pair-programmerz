import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/modules/auth'
import { subscribeToUserRooms } from '@/lib/firebase/rooms'
import type { RoomDocumentWithId } from '@/modules/room/types'

/**
 * Hook to fetch rooms for the current user
 * 
 * Uses TanStack Query with real-time Firestore subscription.
 * Automatically updates when rooms change.
 * 
 * @returns Query result with rooms array
 */
export function useRooms() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [rooms, setRooms] = useState<RoomDocumentWithId[]>([])

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.uid) {
      setRooms([])
      return
    }

    const unsubscribe = subscribeToUserRooms(user.uid, (updatedRooms) => {
      setRooms(updatedRooms)
      // Update query cache
      queryClient.setQueryData(['rooms', user.uid], updatedRooms)
    })

    return () => {
      unsubscribe()
    }
  }, [user?.uid, queryClient])

  // Use query for loading/error states
  const query = useQuery<RoomDocumentWithId[]>({
    queryKey: ['rooms', user?.uid],
    queryFn: () => rooms,
    enabled: !!user?.uid,
    initialData: rooms,
  })

  return {
    ...query,
    data: rooms.length > 0 ? rooms : query.data ?? [],
  }
}

