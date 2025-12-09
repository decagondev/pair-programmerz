import { useTasks as useTasksQuery } from '@/modules/task'
import type { Task } from '@/data/sampleTasks'

/**
 * Hook to fetch available tasks
 * 
 * Uses Firestore tasks collection with fallback to sample tasks.
 * 
 * @returns Query result with tasks array (compatible with Task type for backward compatibility)
 */
export function useTasks() {
  const query = useTasksQuery()
  
  // Map TaskDocumentWithId to Task format for backward compatibility
  // The Task type is compatible with TaskDocumentWithId (just without Firestore fields)
  return {
    ...query,
    data: query.data?.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      estimatedTime: task.estimatedTime,
      starterCode: task.starterCode,
      language: task.language,
    })) as Task[] | undefined,
  }
}

