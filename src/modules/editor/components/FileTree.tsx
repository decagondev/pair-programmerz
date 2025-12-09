import { useFileTree } from '../hooks/useFileTree'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'

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

  if (fileList.length === 0) {
    return (
      <div className={cn('p-4 text-sm text-muted-foreground', className)}>
        No files loaded
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-1 p-2', className)}>
      {fileList.map((filePath) => {
        const isActive = filePath === activeFile
        const fileName = filePath.split('/').pop() ?? filePath

        return (
          <button
            key={filePath}
            onClick={() => switchFile(filePath)}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground font-medium'
            )}
            title={filePath}
          >
            <FileIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{fileName}</span>
          </button>
        )
      })}
    </div>
  )
}

