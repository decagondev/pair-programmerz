import { useState } from 'react'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useDeleteTask } from '../hooks/useDeleteTask'
import type { TaskDocumentWithId } from '../types'

/**
 * Task list component
 * 
 * Displays a list of tasks with actions (edit, delete).
 * 
 * @param tasks - Array of tasks to display
 * @param isLoading - Loading state
 * @param onEdit - Callback when edit is clicked
 */
interface TaskListProps {
  tasks: TaskDocumentWithId[]
  isLoading?: boolean
  onEdit?: (task: TaskDocumentWithId) => void
}

export function TaskList({ tasks, isLoading, onEdit }: TaskListProps) {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const deleteTask = useDeleteTask()

  const handleEdit = (task: TaskDocumentWithId) => {
    onEdit?.(task)
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    setDeleteTaskId(taskId)
    try {
      await deleteTask.mutateAsync(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('Failed to delete task. Please try again.')
    } finally {
      setDeleteTaskId(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No tasks found. Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <Badge className={getDifficultyColor(task.difficulty)}>
                    {task.difficulty}
                  </Badge>
                  <Badge variant="outline">{task.language}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {task.estimatedTime} min
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(task)}
                  aria-label={`Edit ${task.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteTaskId === task.id || deleteTask.isPending}
                  aria-label={`Delete ${task.title}`}
                >
                  {deleteTaskId === task.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

