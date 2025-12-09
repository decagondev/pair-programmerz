import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/lib/firebase/tasks'
import { useAuth } from '@/modules/auth'
import type { CreateTaskInput, TaskDocumentWithId } from '../types'

/**
 * Hook to create a new task
 * 
 * @returns Mutation object with createTask function
 */
export function useCreateTask() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<TaskDocumentWithId, Error, CreateTaskInput>({
    mutationFn: async (input) => {
      if (!user?.uid) {
        throw new Error('User must be authenticated to create tasks')
      }
      return createTask(input, user.uid)
    },
    onSuccess: () => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

