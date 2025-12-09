import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/lib/firebase/tasks'
import type { UpdateTaskInput } from '../types'

/**
 * Hook to update an existing task
 * 
 * @returns Mutation object with updateTask function
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { taskId: string; input: UpdateTaskInput }>({
    mutationFn: async ({ taskId, input }) => {
      return updateTask(taskId, input)
    },
    onSuccess: (_, variables) => {
      // Invalidate tasks query and specific task query
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
    },
  })
}

