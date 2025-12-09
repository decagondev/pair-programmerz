import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateRoom } from '../hooks/useCreateRoom'
import { useTasks } from '../hooks/useTasks'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { Task } from '@/data/sampleTasks'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'

/**
 * Create room form schema
 */
const createRoomSchema = z.object({
  taskId: z.string().nullable(),
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

/**
 * Create room form component
 * 
 * Form for creating a new interview room with task selection.
 */
interface CreateRoomFormProps {
  onSuccess?: () => void
}

export function CreateRoomForm({ onSuccess }: CreateRoomFormProps) {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  const createRoom = useCreateRoom()
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      taskId: null,
    },
  })

  const selectedTaskId = watch('taskId')

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      await createRoom.mutateAsync({
        taskId: data.taskId || null,
      })
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  // Keyboard shortcut: Cmd/Ctrl + Enter to submit
  useKeyboardShortcut(
    ['Meta', 'Enter'],
    () => {
      if (!createRoom.isPending) {
        handleSubmit(onSubmit)()
      }
    },
    { enabled: true }
  )
  useKeyboardShortcut(
    ['Control', 'Enter'],
    () => {
      if (!createRoom.isPending) {
        handleSubmit(onSubmit)()
      }
    },
    { enabled: true }
  )

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="taskId" className="text-sm font-medium">
          Select Task (Optional)
        </label>
        <Select
          value={selectedTaskId || ''}
          onValueChange={(value) => setValue('taskId', value || null)}
        >
          <SelectTrigger id="taskId" className="w-full min-h-[44px]">
            <SelectValue placeholder="Choose a task or leave blank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No task (Custom interview)</SelectItem>
            {tasks.map((task: Task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title} ({task.difficulty})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.taskId && (
          <p className="text-sm text-destructive">{errors.taskId.message}</p>
        )}
        {selectedTaskId && (
          <p className="text-xs text-muted-foreground">
            {tasks.find((t: Task) => t.id === selectedTaskId)?.description}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          disabled={createRoom.isPending}
          className="min-h-[44px] w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createRoom.isPending}
          className="min-h-[44px] w-full sm:w-auto"
        >
          {createRoom.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Room'
          )}
        </Button>
      </div>
    </form>
  )
}

