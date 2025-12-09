import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  type Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/modules/config/firebase'
import type {
  TaskDocument,
  TaskDocumentWithId,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/modules/task/types'

/**
 * Create a new task
 * 
 * Creates a task document in Firestore.
 * 
 * @param input - Task creation data
 * @param userId - User ID of the admin creating the task
 * @returns The created task document with ID
 * @throws {Error} If task creation fails
 */
export async function createTask(
  input: CreateTaskInput,
  userId: string
): Promise<TaskDocumentWithId> {
  try {
    const now = serverTimestamp() as Timestamp
    const taskData: Omit<TaskDocument, 'createdAt' | 'updatedAt'> & {
      createdAt: Timestamp | ReturnType<typeof serverTimestamp>
      updatedAt: Timestamp | ReturnType<typeof serverTimestamp>
    } = {
      title: input.title,
      description: input.description,
      difficulty: input.difficulty,
      estimatedTime: input.estimatedTime,
      starterCode: input.starterCode,
      language: input.language,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    }

    const taskRef = await addDoc(collection(db, 'tasks'), taskData)
    const taskSnap = await getDoc(taskRef)

    if (!taskSnap.exists()) {
      throw new Error('Failed to create task: document not found after creation')
    }

    const data = taskSnap.data() as TaskDocument
    return {
      id: taskSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Create a task with custom ID
 * 
 * Creates a task document in Firestore with a specific document ID.
 * Useful for seeding tasks with known IDs.
 * 
 * @param taskId - Custom task document ID
 * @param input - Task creation data
 * @param userId - User ID of the admin creating the task
 * @returns The created task document with ID
 * @throws {Error} If task creation fails
 */
export async function createTaskWithId(
  taskId: string,
  input: CreateTaskInput,
  userId: string
): Promise<TaskDocumentWithId> {
  try {
    const now = serverTimestamp() as Timestamp
    const taskData: Omit<TaskDocument, 'createdAt' | 'updatedAt'> & {
      createdAt: Timestamp | ReturnType<typeof serverTimestamp>
      updatedAt: Timestamp | ReturnType<typeof serverTimestamp>
    } = {
      title: input.title,
      description: input.description,
      difficulty: input.difficulty,
      estimatedTime: input.estimatedTime,
      starterCode: input.starterCode,
      language: input.language,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    }

    const taskRef = doc(db, 'tasks', taskId)
    await setDoc(taskRef, taskData)
    const taskSnap = await getDoc(taskRef)

    if (!taskSnap.exists()) {
      throw new Error('Failed to create task: document not found after creation')
    }

    const data = taskSnap.data() as TaskDocument
    return {
      id: taskSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get a task by ID
 * 
 * @param taskId - Task document ID
 * @returns Task document with ID, or null if not found
 * @throws {Error} If query fails
 */
export async function getTaskById(
  taskId: string
): Promise<TaskDocumentWithId | null> {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    const taskSnap = await getDoc(taskRef)

    if (!taskSnap.exists()) {
      return null
    }

    const data = taskSnap.data() as TaskDocument
    return {
      id: taskSnap.id,
      ...data,
    }
  } catch (error) {
    throw new Error(
      `Failed to get task: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get all tasks
 * 
 * Fetches all tasks ordered by creation date (newest first).
 * 
 * @returns Array of task documents with IDs
 * @throws {Error} If query fails
 */
export async function getAllTasks(): Promise<TaskDocumentWithId[]> {
  try {
    const tasksRef = collection(db, 'tasks')
    const q = query(tasksRef, orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    const tasks: TaskDocumentWithId[] = []

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TaskDocument
      tasks.push({
        id: docSnap.id,
        ...data,
      })
    })

    return tasks
  } catch (error) {
    throw new Error(
      `Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Update a task
 * 
 * Updates task document fields. Automatically updates `updatedAt` timestamp.
 * 
 * @param taskId - Task document ID
 * @param input - Partial task data to update
 * @throws {Error} If update fails
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    const updateData: Record<string, unknown> = {
      ...input,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(taskRef, updateData)
  } catch (error) {
    throw new Error(
      `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a task
 * 
 * Deletes a task document from Firestore.
 * 
 * @param taskId - Task document ID
 * @throws {Error} If deletion fails
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await deleteDoc(taskRef)
  } catch (error) {
    throw new Error(
      `Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Subscribe to all tasks (real-time)
 * 
 * Sets up a real-time listener for all tasks.
 * Returns an unsubscribe function.
 * 
 * @param callback - Callback function called with task updates
 * @returns Unsubscribe function
 */
export function subscribeToTasks(
  callback: (tasks: TaskDocumentWithId[]) => void
): () => void {
  const tasksRef = collection(db, 'tasks')
  const q = query(tasksRef, orderBy('createdAt', 'desc'))

  return onSnapshot(
    q,
    (querySnapshot) => {
      const tasks: TaskDocumentWithId[] = []

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as TaskDocument
        tasks.push({
          id: docSnap.id,
          ...data,
        })
      })

      callback(tasks)
    },
    (error) => {
      console.error('Error in tasks subscription:', error)
      callback([])
    }
  )
}

