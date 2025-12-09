import { useQuery } from '@tanstack/react-query'
import { getAllTasks } from '@/data/sampleTasks'
import type { Task } from '@/data/sampleTasks'

/**
 * Hook to fetch available tasks
 * 
 * For now, returns hardcoded sample tasks.
 * In Epic 7, this will query Firestore tasks collection.
 * 
 * @returns Query result with tasks array
 */
export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getAllTasks(),
    staleTime: 1000 * 60 * 60, // 1 hour - tasks don't change often
  })
}

