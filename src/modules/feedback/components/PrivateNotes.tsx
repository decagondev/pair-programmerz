import { useState, useEffect, useCallback } from 'react'
import { usePrivateNotes } from '../hooks/usePrivateNotes'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'

/**
 * Props for PrivateNotes component
 */
interface PrivateNotesProps {
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
 * Private notes component
 * 
 * Rich text editor for interviewers to take private notes during the session.
 * Auto-saves with debouncing (500ms) on typing.
 * Visible only to interviewers.
 * 
 * @param props - Component props
 */
export function PrivateNotes({ roomId }: PrivateNotesProps) {
  const { notes, isLoading, savePrivateNotes, isSaving } = usePrivateNotes(roomId)
  const [content, setContent] = useState(notes?.content || '')

  // Initialize content with existing notes
  useEffect(() => {
    if (notes) {
      setContent(notes.content)
    }
  }, [notes])

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce(async (...args: unknown[]) => {
      const text = args[0] as string
      try {
        await savePrivateNotes({ content: text })
      } catch (error) {
        console.error('Failed to auto-save private notes:', error)
      }
    }, 500),
    [savePrivateNotes]
  )

  // Auto-save on content changes
  useEffect(() => {
    if (content !== (notes?.content || '')) {
      debouncedSave(content)
    }
  }, [content, notes?.content, debouncedSave])

  // Handle field blur (immediate save)
  const handleBlur = useCallback(async () => {
    if (content.trim()) {
      try {
        await savePrivateNotes({ content })
      } catch (error) {
        console.error('Failed to save private notes on blur:', error)
      }
    }
  }, [content, savePrivateNotes])

  // Manual save handler
  const handleSave = async () => {
    try {
      await savePrivateNotes({ content })
    } catch (error) {
      console.error('Failed to save private notes:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Private Notes</CardTitle>
        <CardDescription>
          Your private notes for this interview. Only you can see these notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex-1">
          <Textarea
            placeholder="Take notes during the interview... (auto-saves as you type)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            className="min-h-[300px] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

