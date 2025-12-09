import { useQuery } from '@tanstack/react-query'
import { Timestamp } from 'firebase/firestore'
import { getTaskById } from '@/lib/firebase/tasks'
import { getTaskById as getSampleTaskById } from '@/data/sampleTasks'
import type { TaskDocumentWithId } from '../types'

/**
 * Hook to fetch a single task by ID
 * 
 * Falls back to sample tasks if Firestore query fails.
 * 
 * @param taskId - Task ID
 * @returns Query result with task or undefined
 */
export function useTask(taskId: string | null) {
  return useQuery<TaskDocumentWithId | null>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!taskId) {
        return null
      }

      try {
        const task = await getTaskById(taskId)
        if (task) {
          return task
        }

        // Fall back to sample tasks
        const sampleTask = getSampleTaskById(taskId)
        if (sampleTask) {
          const now = Timestamp.now()
          return {
            ...sampleTask,
            createdAt: now,
            updatedAt: now,
            createdBy: 'system',
          } as TaskDocumentWithId
        }

        return null
      } catch (error) {
        // Fall back to sample tasks on error
        console.warn('Failed to fetch task from Firestore, using sample tasks:', error)
        const sampleTask = getSampleTaskById(taskId)
        if (sampleTask) {
          const now = Timestamp.now()
          return {
            ...sampleTask,
            createdAt: now,
            updatedAt: now,
            createdBy: 'system',
          } as TaskDocumentWithId
        }
        return null
      }
    },
    enabled: !!taskId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

