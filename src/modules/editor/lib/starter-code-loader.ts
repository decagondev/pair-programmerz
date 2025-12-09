import type { TaskDocumentWithId } from '@/modules/task/types'
import type { Task } from '@/data/sampleTasks'

/**
 * Parse starter code into file structure
 * 
 * For now, we'll create a single file from the starter code.
 * In the future, this could parse multi-file structures.
 * 
 * @param task - Task with starter code (TaskDocumentWithId or Task)
 * @returns Map of file paths to file contents
 */
export function parseStarterCode(task: TaskDocumentWithId | Task): Record<string, string> {
  const files: Record<string, string> = {}

  if (task.starterCode) {
    // For now, create a single file based on task language
    const extension = task.language === 'typescript' ? 'tsx' : task.language === 'javascript' ? 'jsx' : task.language
    const fileName = `src/App.${extension}`
    files[fileName] = task.starterCode
  } else {
    // Default empty file
    const extension = task.language === 'typescript' ? 'tsx' : task.language === 'javascript' ? 'jsx' : task.language
    const fileName = `src/App.${extension}`
    files[fileName] = `// ${task.title}\n// ${task.description}\n\n`
  }

  return files
}

/**
 * Create initial file tree structure
 * 
 * Creates a basic file tree structure for the editor.
 * 
 * @param files - Map of file paths to contents
 * @returns File tree structure
 */
export function createFileTree(files: Record<string, string>): string[] {
  return Object.keys(files).sort()
}

