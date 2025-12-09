/**
 * Editor module
 * 
 * This module handles the collaborative code editor functionality.
 * 
 * @module editor
 */

// Components
export { LiveblocksRoomProvider } from './components/LiveblocksRoomProvider'
export { PresenceIndicator } from './components/PresenceIndicator'
export { CodeEditor } from './components/CodeEditor'
export { DriverIndicator } from './components/DriverIndicator'
export { DriverControls } from './components/DriverControls'
export { FileTree } from './components/FileTree'
export { EditorLayout } from './components/EditorLayout'

// Hooks
export { usePresence } from './hooks/usePresence'
export { useCodeEditor } from './hooks/useCodeEditor'
export { useDriver } from './hooks/useDriver'
export { useFileTree } from './hooks/useFileTree'

// Types
export type {
  EditorPresence,
  EditorStorage,
  EditorFile,
  FileTreeNode,
} from './types'
