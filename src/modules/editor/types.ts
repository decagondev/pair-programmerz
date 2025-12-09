import type { UserRole } from '@/modules/store/types'

/**
 * Editor presence data
 * 
 * Represents a user's presence in the editor (cursor position, name, role, etc.)
 */
export interface EditorPresence {
  /**
   * User's display name
   */
  name: string
  /**
   * User's role (interviewer or candidate)
   */
  role: UserRole | null
  /**
   * User's avatar URL (optional)
   */
  avatar?: string
  /**
   * Cursor position (line, column)
   */
  cursor?: {
    line: number
    column: number
  }
  /**
   * Whether the user is currently typing
   */
  isTyping?: boolean
}

/**
 * Editor storage structure
 * 
 * Defines the shape of data stored in Liveblocks storage for the editor
 */
export interface EditorStorage {
  /**
   * Current driver's user ID (null if no driver)
   */
  driverId: string | null
  /**
   * Map of file paths to file contents
   * Key: file path (e.g., "src/App.tsx")
   * Value: file content (string)
   */
  files: Record<string, string>
  /**
   * Currently active file path
   */
  activeFile?: string
}

/**
 * Editor file interface
 * 
 * Represents a single file in the editor
 */
export interface EditorFile {
  /**
   * File path (e.g., "src/App.tsx")
   */
  path: string
  /**
   * File content
   */
  content: string
  /**
   * Programming language
   */
  language: 'typescript' | 'javascript' | 'python' | 'java'
}

/**
 * File tree structure
 * 
 * Represents the file tree hierarchy
 */
export interface FileTreeNode {
  /**
   * File or folder name
   */
  name: string
  /**
   * Full path
   */
  path: string
  /**
   * Whether this is a folder
   */
  isFolder: boolean
  /**
   * Children (if folder)
   */
  children?: FileTreeNode[]
}

