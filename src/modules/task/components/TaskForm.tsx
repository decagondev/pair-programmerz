import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { CreateTaskInput, UpdateTaskInput, TaskDocumentWithId } from '../types'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'

/**
 * Task form schema
 */
const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedTime: z.number().min(1, 'Estimated time must be at least 1 minute'),
  starterCode: z.string().optional(),
  language: z.enum(['typescript', 'javascript', 'python', 'java']),
})

type TaskFormData = z.infer<typeof taskFormSchema>

/**
 * Task form component
 * 
 * Form for creating or editing a task.
 * 
 * @param task - Existing task to edit (optional)
 * @param onSubmit - Callback when form is submitted
 * @param onCancel - Callback when form is cancelled
 * @param isLoading - Loading state
 */
interface TaskFormProps {
  task?: TaskDocumentWithId
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          estimatedTime: task.estimatedTime,
          starterCode: task.starterCode,
          language: task.language,
        }
      : {
          title: '',
          description: '',
          difficulty: 'medium',
          estimatedTime: 30,
          starterCode: '',
          language: 'typescript',
        },
  })

  const difficulty = watch('difficulty')
  const language = watch('language')

  const onFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data)
  }

  // Keyboard shortcut: Cmd/Ctrl + Enter to submit
  useKeyboardShortcut(
    ['Meta', 'Enter'],
    () => {
      if (!isLoading) {
        handleSubmit(onFormSubmit)()
      }
    },
    { enabled: true }
  )
  useKeyboardShortcut(
    ['Control', 'Enter'],
    () => {
      if (!isLoading) {
        handleSubmit(onFormSubmit)()
      }
    },
    { enabled: true }
  )

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Task title"
          className="w-full min-h-[44px]"
          aria-invalid={errors.title ? 'true' : 'false'}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Task description (Markdown supported)"
          rows={4}
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Difficulty and Language */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <Select
            value={difficulty}
            onValueChange={(value) => setValue('difficulty', value as 'easy' | 'medium' | 'hard')}
          >
            <SelectTrigger id="difficulty" className="w-full min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="language" className="text-sm font-medium">
            Language
          </label>
          <Select
            value={language}
            onValueChange={(value) =>
              setValue('language', value as 'typescript' | 'javascript' | 'python' | 'java')
            }
          >
            <SelectTrigger id="language" className="w-full min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="space-y-2">
        <label htmlFor="estimatedTime" className="text-sm font-medium">
          Estimated Time (minutes)
        </label>
        <Input
          id="estimatedTime"
          type="number"
          min="1"
          {...register('estimatedTime', { valueAsNumber: true })}
          placeholder="30"
          className="w-full min-h-[44px]"
          aria-invalid={errors.estimatedTime ? 'true' : 'false'}
        />
        {errors.estimatedTime && (
          <p className="text-sm text-destructive">{errors.estimatedTime.message}</p>
        )}
      </div>

      {/* Starter Code */}
      <div className="space-y-2">
        <label htmlFor="starterCode" className="text-sm font-medium">
          Starter Code (optional)
        </label>
        <Textarea
          id="starterCode"
          {...register('starterCode')}
          placeholder="// Starter code here..."
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-h-[44px] w-full sm:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

