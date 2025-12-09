/**
 * Task module
 * 
 * This module handles the task library and task management.
 * 
 * @module task
 */

// Components
export { AdminTasksPage } from './components/AdminTasksPage'
export { TaskList } from './components/TaskList'
export { TaskForm } from './components/TaskForm'
export { TaskDialog } from './components/TaskDialog'

// Hooks
export { useTasks } from './hooks/useTasks'
export { useTask } from './hooks/useTask'
export { useCreateTask } from './hooks/useCreateTask'
export { useUpdateTask } from './hooks/useUpdateTask'
export { useDeleteTask } from './hooks/useDeleteTask'

// Types
export type {
  TaskDocument,
  TaskDocumentWithId,
  CreateTaskInput,
  UpdateTaskInput,
} from './types'
