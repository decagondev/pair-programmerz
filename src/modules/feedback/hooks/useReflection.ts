import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/modules/auth'
import {
  getReflection,
  saveReflection,
  subscribeToReflection,
} from '@/lib/firebase/reflections'
import type {
  ReflectionDocumentWithId,
  CreateReflectionInput,
} from '../types'

/**
 * Hook for reflection data
 * 
 * Provides reflection query and mutation with real-time updates.
 * 
 * @param roomId - Room ID
 * @returns Reflection data, loading state, and save mutation
 */
export function useReflection(roomId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [reflection, setReflection] = useState<ReflectionDocumentWithId | null>(null)

  const userId = user?.uid

  // Set up real-time subscription
  useEffect(() => {
    if (!roomId || !userId) {
      setReflection(null)
      return
    }

    const unsubscribe = subscribeToReflection(roomId, userId, (updated) => {
      setReflection(updated)
      queryClient.setQueryData(['reflection', roomId, userId], updated)
    })

    return () => unsubscribe()
  }, [roomId, userId, queryClient])

  // TanStack Query for loading/error states
  const query = useQuery({
    queryKey: ['reflection', roomId, userId],
    queryFn: async () => {
      if (!roomId || !userId) return null
      return await getReflection(roomId, userId)
    },
    enabled: !!roomId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Use subscription data if available, otherwise use query data
  const reflectionData = reflection ?? query.data ?? null

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (input: CreateReflectionInput) => {
      if (!roomId || !userId) {
        throw new Error('Room ID and user ID are required')
      }
      await saveReflection(roomId, userId, input)
    },
    onSuccess: () => {
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['reflection', roomId, userId] })
    },
  })

  return {
    reflection: reflectionData,
    isLoading: query.isLoading && !reflection,
    error: query.error,
    saveReflection: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  }
}

