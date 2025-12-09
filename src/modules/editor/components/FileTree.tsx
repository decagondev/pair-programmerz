import { useFileTree } from '../hooks/useFileTree'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * Props for FileTree component
 */
interface FileTreeProps {
  /**
   * Room ID (for loading task files)
   */
  roomId: string | null
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * File tree component
 * 
 * Displays a simple file tree showing all files in the editor.
 * Clicking a file switches to that file.
 * 
 * @param props - Component props
 */
export function FileTree({ roomId, className }: FileTreeProps) {
  const { fileList, activeFile, switchFile } = useFileTree(roomId)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Focus management for keyboard navigation
  useEffect(() => {
    const activeIndex = fileList.findIndex((file) => file === activeFile)
    if (activeIndex >= 0) {
      const activeButton = buttonRefs.current.get(activeFile || '')
      if (activeButton) {
        activeButton.focus()
      }
    }
  }, [activeFile, fileList])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, filePath: string) => {
    const currentIndex = fileList.findIndex((file) => file === filePath)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (currentIndex < fileList.length - 1) {
          const nextFile = fileList[currentIndex + 1]
          switchFile(nextFile)
          buttonRefs.current.get(nextFile)?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (currentIndex > 0) {
          const prevFile = fileList[currentIndex - 1]
          switchFile(prevFile)
          buttonRefs.current.get(prevFile)?.focus()
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        switchFile(filePath)
        break
    }
  }

  if (fileList.length === 0) {
    return (
      <div className={cn('p-4 text-sm text-muted-foreground', className)} role="status" aria-live="polite">
        No files loaded
      </div>
    )
  }

  return (
    <nav className={cn('flex flex-col gap-1 p-2', className)} aria-label="File tree navigation">
      {fileList.map((filePath) => {
        const isActive = filePath === activeFile
        const fileName = filePath.split('/').pop() ?? filePath

        return (
          <button
            key={filePath}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(filePath, el)
              } else {
                buttonRefs.current.delete(filePath)
              }
            }}
            onClick={() => switchFile(filePath)}
            onKeyDown={(e) => handleKeyDown(e, filePath)}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive && 'bg-accent text-accent-foreground font-medium'
            )}
            title={filePath}
            aria-label={`Switch to file ${fileName}`}
            aria-current={isActive ? 'page' : undefined}
            role="menuitem"
          >
            <FileIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{fileName}</span>
          </button>
        )
      })}
    </nav>
  )
}

