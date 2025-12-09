import { useQuery } from '@tanstack/react-query'
import { Timestamp } from 'firebase/firestore'
import { getAllTasks } from '@/lib/firebase/tasks'
import { getAllTasks as getSampleTasks } from '@/data/sampleTasks'
import type { TaskDocumentWithId } from '../types'

/**
 * Hook to fetch all tasks from Firestore
 * 
 * Falls back to sample tasks if Firestore query fails or returns empty.
 * 
 * @returns Query result with tasks array
 */
export function useTasks() {
  return useQuery<TaskDocumentWithId[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const tasks = await getAllTasks()
        // If Firestore returns empty, fall back to sample tasks
        if (tasks.length === 0) {
          const sampleTasks = getSampleTasks()
        // Convert sample tasks to TaskDocumentWithId format
        // Note: This is a fallback, so we'll use current timestamp
        const now = Timestamp.now()
        return sampleTasks.map((task) => ({
          ...task,
          createdAt: now,
          updatedAt: now,
          createdBy: 'system',
        })) as TaskDocumentWithId[]
        }
        return tasks
      } catch (error) {
        // Fall back to sample tasks on error
        console.warn('Failed to fetch tasks from Firestore, using sample tasks:', error)
        const sampleTasks = getSampleTasks()
        const now = Timestamp.now()
        return sampleTasks.map((task) => ({
          ...task,
          createdAt: now,
          updatedAt: now,
          createdBy: 'system',
        })) as TaskDocumentWithId[]
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour - tasks don't change often
  })
}

