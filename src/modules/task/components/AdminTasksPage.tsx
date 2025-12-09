import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskList } from './TaskList'
import { TaskDialog } from './TaskDialog'
import { useTasks } from '../hooks/useTasks'
import { useCreateTask } from '../hooks/useCreateTask'
import { useUpdateTask } from '../hooks/useUpdateTask'
import type { CreateTaskInput, UpdateTaskInput, TaskDocumentWithId } from '../types'

/**
 * Admin tasks page component
 * 
 * Main page for managing tasks (CRUD operations).
 * Only accessible to admins.
 */
export function AdminTasksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskDocumentWithId | undefined>()
  const { data: tasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const handleCreate = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      await createTask.mutateAsync(data as CreateTaskInput)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task. Please try again.')
    }
  }

  const handleUpdate = async (data: UpdateTaskInput) => {
    if (!editingTask) {
      return
    }

    try {
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        input: data,
      })
      setEditingTask(undefined)
    } catch (error) {
      console.error('Failed to update task:', error)
      alert('Failed to update task. Please try again.')
    }
  }

  const handleEdit = (task: TaskDocumentWithId) => {
    setEditingTask(task)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Library</h1>
            <p className="mt-1 text-muted-foreground">
              Manage interview tasks and starter code
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Task list */}
        <TaskList tasks={tasks} isLoading={isLoading} onEdit={handleEdit} />

        {/* Create task dialog */}
        <TaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreate}
          isLoading={createTask.isPending}
        />

        {/* Edit task dialog */}
        {editingTask && (
          <TaskDialog
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(undefined)}
            task={editingTask}
            onSubmit={handleUpdate}
            isLoading={updateTask.isPending}
          />
        )}
      </div>
    </div>
  )
}

