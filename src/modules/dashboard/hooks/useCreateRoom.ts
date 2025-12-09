import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth'
import { createRoom, updateRoom } from '@/lib/firebase/rooms'
import { generateMagicLinkToken, generateMagicLinkUrl } from '@/lib/firebase/magicLink'
import type { CreateRoomInput } from '@/modules/room/types'
import { Timestamp } from 'firebase/firestore'

/**
 * Hook to create a new room
 * 
 * Creates a room, generates magic link token, and redirects to the room.
 * 
 * @returns Mutation object with createRoom function
 */
export function useCreateRoom() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<CreateRoomInput, 'createdBy'>) => {
      if (!user?.uid) {
        throw new Error('User must be authenticated to create a room')
      }

      // Create room
      const room = await createRoom({
        ...input,
        createdBy: user.uid,
      })

      // Generate magic link token
      const token = generateMagicLinkToken(room.id, 'candidate', 24)
      const magicLinkUrl = generateMagicLinkUrl(token)

      // Update room with magic link token
      const expiresAt = Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      await updateRoom(room.id, {
        magicLinkToken: token,
        magicLinkExpiresAt: expiresAt,
      })

      return {
        room,
        magicLinkUrl,
        token,
      }
    },
    onSuccess: (data) => {
      // Invalidate rooms query to refetch
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      
      // Navigate to the new room
      navigate(`/room/${data.room.id}`)
    },
  })
}

