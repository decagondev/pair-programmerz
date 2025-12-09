import { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useReflection } from '../hooks/useReflection'
import { DEFAULT_REFLECTION_QUESTIONS } from '../types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import type { ReflectionResponse } from '../types'

/**
 * Reflection form schema
 * 
 * Validates reflection form data using zod.
 */
const reflectionFormSchema = z.object({
  responses: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
})

type ReflectionFormData = z.infer<typeof reflectionFormSchema>

/**
 * Props for ReflectionForm component
 */
interface ReflectionFormProps {
  /** Room ID */
  roomId: string
}

/**
 * Debounce utility
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Reflection form component
 * 
 * Form for candidates to complete reflection questions during reflection phase.
 * Auto-saves on field blur and with debouncing (500ms) on typing.
 * 
 * @param props - Component props
 */
export function ReflectionForm({ roomId }: ReflectionFormProps) {
  const { reflection, isLoading, saveReflection, isSaving } = useReflection(roomId)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ReflectionFormData>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      responses: DEFAULT_REFLECTION_QUESTIONS.map((q) => ({
        questionId: q.id,
        answer: '',
      })),
    },
  })

  // Initialize form with existing reflection data
  useEffect(() => {
    if (reflection && reflection.responses.length > 0) {
      setValue('responses', reflection.responses)
    }
  }, [reflection, setValue])

  // Watch all responses for auto-save
  const watchedResponses = watch('responses')

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce(async (...args: unknown[]) => {
      const responses = args[0] as ReflectionResponse[]
      try {
        await saveReflection({ responses })
      } catch (error) {
        console.error('Failed to auto-save reflection:', error)
      }
    }, 500),
    [saveReflection]
  )

  // Auto-save on changes
  useEffect(() => {
    if (watchedResponses && isDirty) {
      debouncedSave(watchedResponses)
    }
  }, [watchedResponses, isDirty, debouncedSave])

  // Handle field blur (immediate save)
  const handleBlur = useCallback(
    async (questionId: string) => {
      const currentResponses = watchedResponses || []
      const response = currentResponses.find((r) => r.questionId === questionId)
      if (response && response.answer.trim()) {
        try {
          await saveReflection({ responses: currentResponses })
        } catch (error) {
          console.error('Failed to save reflection on blur:', error)
        }
      }
    },
    [watchedResponses, saveReflection]
  )

  // Manual save handler
  const onSubmit = async (data: ReflectionFormData) => {
    try {
      await saveReflection(data)
    } catch (error) {
      console.error('Failed to save reflection:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Reflection Questions</CardTitle>
          <CardDescription>
            Please take a few minutes to reflect on your experience. Your responses will be
            automatically saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {DEFAULT_REFLECTION_QUESTIONS.map((question, index) => {
              const response = watchedResponses?.find((r) => r.questionId === question.id)
              const answer = response?.answer || ''

              return (
                <div key={question.id} className="space-y-2">
                  <label
                    htmlFor={question.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {question.label}
                  </label>
                  <Textarea
                    id={question.id}
                    placeholder={question.placeholder}
                    rows={4}
                    {...register(`responses.${index}.questionId`)}
                    value={answer}
                    onChange={(e) => {
                      const newResponses = [...(watchedResponses || [])]
                      const existingIndex = newResponses.findIndex(
                        (r) => r.questionId === question.id
                      )
                      const newResponse: ReflectionResponse = {
                        questionId: question.id,
                        answer: e.target.value,
                      }

                      if (existingIndex >= 0) {
                        newResponses[existingIndex] = newResponse
                      } else {
                        newResponses.push(newResponse)
                      }

                      setValue('responses', newResponses, { shouldDirty: true })
                    }}
                    onBlur={() => handleBlur(question.id)}
                    className="min-h-[100px]"
                  />
                  {errors.responses?.[index] && (
                    <p className="text-sm text-destructive">
                      {errors.responses[index]?.answer?.message}
                    </p>
                  )}
                </div>
              )
            })}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

