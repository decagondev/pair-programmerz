import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import type { CreateTaskInput, UpdateTaskInput, TaskDocumentWithId } from '../types'

/**
 * Task dialog component
 * 
 * Dialog wrapper for task form (create or edit).
 * 
 * @param open - Whether dialog is open
 * @param onOpenChange - Callback when dialog open state changes
 * @param task - Existing task to edit (optional, if not provided creates new task)
 * @param onSubmit - Callback when form is submitted
 * @param isLoading - Loading state
 */
interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: TaskDocumentWithId
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void | Promise<void>
  isLoading?: boolean
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  isLoading,
}: TaskDialogProps) {
  const handleSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the task details below.'
              : 'Fill in the details to create a new task for interviews.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

