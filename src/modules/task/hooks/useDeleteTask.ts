import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/lib/firebase/tasks'

/**
 * Hook to delete a task
 * 
 * @returns Mutation object with deleteTask function
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      return deleteTask(taskId)
    },
    onSuccess: (_, taskId) => {
      // Invalidate tasks query and specific task query
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}

