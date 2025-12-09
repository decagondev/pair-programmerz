import { useEffect } from 'react'
import { useCodeEditor } from '../hooks/useCodeEditor'
import { usePhaseLock } from '@/modules/timer'
import { cn } from '@/lib/utils'

/**
 * Props for CodeEditor component
 */
interface CodeEditorProps {
  /**
   * Initial code content
   * If not provided, will load from activeFile
   */
  initialContent?: string
  /**
   * Whether the editor should be read-only
   * If not provided, will be determined by driver status
   */
  readOnly?: boolean
  /**
   * Programming language
   */
  language?: 'typescript' | 'javascript'
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether current user is driver (for read-only mode)
   */
  isDriver?: boolean
  /**
   * Active file path (for file switching)
   */
  activeFile?: string | null
  /**
   * File content (for file switching)
   */
  fileContent?: string
  /**
   * Room ID (for phase lock checking)
   */
  roomId?: string
}

/**
 * Code editor component
 * 
 * Collaborative code editor using CodeMirror 6 with Yjs binding for real-time synchronization.
 * Supports read-only mode and multiple programming languages.
 * 
 * @param props - Component props
 */
export function CodeEditor({
  initialContent,
  readOnly,
  language = 'typescript',
  className,
  isDriver = false,
  activeFile,
  fileContent,
  roomId,
}: CodeEditorProps) {
  // Use fileContent if provided, otherwise use initialContent
  const content = fileContent ?? initialContent ?? ''

  // Check phase lock if roomId is provided
  const { isEditorLocked } = usePhaseLock(roomId ?? '')

  // If readOnly is not explicitly provided, determine from driver status and phase lock
  // Editor is read-only if: explicitly set, user is not driver, or phase locks editor
  const editorReadOnly =
    readOnly ?? (!isDriver || (roomId ? isEditorLocked : false))

  const { editorRef, isReady, setContent } = useCodeEditor(content, editorReadOnly, language)

  // Update editor content when file changes
  useEffect(() => {
    if (fileContent !== undefined && isReady) {
      setContent(fileContent)
    }
  }, [fileContent, activeFile, isReady, setContent])

  return (
    <div className={cn('h-full w-full overflow-hidden', className)}>
      <div
        ref={editorRef}
        className={cn(
          'h-full w-full',
          !isReady && 'opacity-50'
        )}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      )}
    </div>
  )
}

