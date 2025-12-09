import { sampleTasks } from '@/data/sampleTasks'
import { createTaskWithId, getTaskById } from './tasks'

/**
 * Seed tasks from sample tasks
 * 
 * Migrates the 6 sample tasks to Firestore with their original IDs.
 * This function can be called manually or from a Cloud Function.
 * 
 * @param userId - User ID of the admin seeding tasks (defaults to 'system')
 * @returns Array of created task IDs
 * @throws {Error} If seeding fails
 */
export async function seedTasks(userId: string = 'system'): Promise<string[]> {
  const createdTaskIds: string[] = []

  for (const sampleTask of sampleTasks) {
    try {
      // Check if task already exists
      const existingTask = await getTaskById(sampleTask.id)
      if (existingTask) {
        console.log(`Task ${sampleTask.id} already exists, skipping...`)
        createdTaskIds.push(sampleTask.id)
        continue
      }

      // Create task with custom ID
      const task = await createTaskWithId(
        sampleTask.id,
        {
          title: sampleTask.title,
          description: sampleTask.description,
          difficulty: sampleTask.difficulty,
          estimatedTime: sampleTask.estimatedTime,
          starterCode: sampleTask.starterCode,
          language: sampleTask.language,
        },
        userId
      )

      createdTaskIds.push(task.id)
      console.log(`Created task: ${task.id} - ${task.title}`)
    } catch (error) {
      console.error(`Failed to seed task ${sampleTask.id}:`, error)
      // Continue with other tasks even if one fails
    }
  }

  return createdTaskIds
}

/**
 * Seed tasks utility function for use in browser console
 * 
 * This function can be called from the browser console after authentication.
 * Example: window.seedTasks()
 * 
 * Note: This requires the user to be authenticated and have admin access.
 */
export function setupSeedTasksUtility() {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window for console access
    window.seedTasks = async () => {
      try {
        // Get current user from auth
        const { getAuth } = await import('firebase/auth')
        const { auth } = await import('@/modules/config/firebase')
        const authInstance = getAuth(auth.app)
        const user = authInstance.currentUser

        if (!user) {
          throw new Error('User must be authenticated to seed tasks')
        }

        console.log('Starting task seeding...')
        const taskIds = await seedTasks(user.uid)
        console.log(`Successfully seeded ${taskIds.length} tasks:`, taskIds)
        return taskIds
      } catch (error) {
        console.error('Failed to seed tasks:', error)
        throw error
      }
    }
  }
}

