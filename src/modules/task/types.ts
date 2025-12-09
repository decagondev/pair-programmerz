import type { Timestamp } from 'firebase/firestore'
import type { Task } from '@/data/sampleTasks'

/**
 * Task document interface
 * 
 * Represents a task document in Firestore.
 * Extends the base Task interface with Firestore-specific fields.
 */
export interface TaskDocument extends Omit<Task, 'id'> {
  /** Timestamp when task was created */
  createdAt: Timestamp
  /** Timestamp when task was last updated */
  updatedAt: Timestamp
  /** UID of the admin who created the task */
  createdBy: string
}

/**
 * Task document with ID
 * 
 * Task document including the document ID.
 */
export interface TaskDocumentWithId extends TaskDocument {
  id: string
}

/**
 * Create task input
 * 
 * Data required to create a new task.
 */
export interface CreateTaskInput {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  starterCode?: string
  language: 'typescript' | 'javascript' | 'python' | 'java'
}

/**
 * Update task input
 * 
 * Partial data for updating a task.
 */
export interface UpdateTaskInput {
  title?: string
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  estimatedTime?: number
  starterCode?: string
  language?: 'typescript' | 'javascript' | 'python' | 'java'
}

