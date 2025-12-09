import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/modules/auth'
import {
  getPrivateNotes,
  savePrivateNotes,
  subscribeToPrivateNotes,
} from '@/lib/firebase/privateNotes'
import type {
  PrivateNotesDocumentWithId,
  CreatePrivateNotesInput,
} from '../types'

/**
 * Hook for private notes data
 * 
 * Provides private notes query and mutation with real-time updates.
 * 
 * @param roomId - Room ID
 * @returns Private notes data, loading state, and save mutation
 */
export function usePrivateNotes(roomId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState<PrivateNotesDocumentWithId | null>(null)

  const userId = user?.uid

  // Set up real-time subscription
  useEffect(() => {
    if (!roomId || !userId) {
      setNotes(null)
      return
    }

    const unsubscribe = subscribeToPrivateNotes(roomId, userId, (updated) => {
      setNotes(updated)
      queryClient.setQueryData(['privateNotes', roomId, userId], updated)
    })

    return () => unsubscribe()
  }, [roomId, userId, queryClient])

  // TanStack Query for loading/error states
  const query = useQuery({
    queryKey: ['privateNotes', roomId, userId],
    queryFn: async () => {
      if (!roomId || !userId) return null
      return await getPrivateNotes(roomId, userId)
    },
    enabled: !!roomId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Use subscription data if available, otherwise use query data
  const notesData = notes ?? query.data ?? null

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (input: CreatePrivateNotesInput) => {
      if (!roomId || !userId) {
        throw new Error('Room ID and user ID are required')
      }
      await savePrivateNotes(roomId, userId, input)
    },
    onSuccess: () => {
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['privateNotes', roomId, userId] })
    },
  })

  return {
    notes: notesData,
    isLoading: query.isLoading && !notes,
    error: query.error,
    savePrivateNotes: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  }
}

