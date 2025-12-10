import { useEffect, useState } from 'react'
import { useStorage, useMutation, useStatus } from '@liveblocks/react'
import { useRoom } from '@/modules/room'
import { useTask } from '@/modules/task'
import { parseStarterCode, createFileTree } from '../lib/starter-code-loader'

/**
 * File tree management hook
 * 
 * Manages file tree state, loads starter code from tasks, and manages active file selection.
 * Files are stored in Liveblocks storage for real-time synchronization.
 * 
 * @param roomId - Firestore room ID
 * @returns File tree state and functions
 */
export function useFileTree(roomId: string | null) {
  const { data: room } = useRoom(roomId ?? '')
  const { data: task } = useTask(room?.taskId ?? null)
  const status = useStatus()
  
  // Get files from Liveblocks storage
  const storageFiles = useStorage((root) => {
    const files = (root as { files?: Record<string, string> }).files
    return files ?? {}
  })

  // Get active file from storage
  const activeFile = useStorage((root) => {
    return (root as { activeFile?: string }).activeFile ?? null
  })
  
  // Check if storage is loading - use storageFiles as indicator
  // If storageFiles is null/undefined, storage isn't ready yet
  const isStorageLoading = storageFiles === null || storageFiles === undefined

  // Local state for file list
  const [files, setFiles] = useState<Record<string, string>>(storageFiles ?? {})
  const [fileList, setFileList] = useState<string[]>([])

  // Mutation to update files in storage
  const updateFiles = useMutation(({ storage }, newFiles: Record<string, string>) => {
    if (!storage) {
      throw new Error('Storage not available')
    }
    storage.set('files', newFiles)
  }, [])

  // Mutation to set active file
  const setActiveFile = useMutation(({ storage }, filePath: string | null) => {
    if (!storage) {
      throw new Error('Storage not available')
    }
    storage.set('activeFile', filePath)
  }, [])

  // Load starter code when room task is available and storage is ready
  useEffect(() => {
    // Wait for storage to be loaded
    if (status !== 'connected' || isStorageLoading || !task || Object.keys(files).length > 0) {
      return
    }

    // Check if storage is actually available by checking if we can read from it
    // If storageFiles is still null/undefined, storage isn't ready yet
    if (storageFiles === null || storageFiles === undefined) {
      return
    }

    // If storage already has files, don't overwrite
    if (Object.keys(storageFiles).length > 0) {
      return
    }

    const parsedFiles = parseStarterCode(task)
    setFiles(parsedFiles)
    
    // Update storage - it should be ready now since isStorageLoading is false
    // Use a small delay to ensure storage is fully initialized
    const timeoutId = setTimeout(() => {
      try {
        updateFiles(parsedFiles)
        
        // Set first file as active
        const filePaths = createFileTree(parsedFiles)
        if (filePaths.length > 0) {
          setActiveFile(filePaths[0])
        }
      } catch (error) {
        // If storage still not ready, log warning but don't crash
        // The effect will retry on next render when storage is ready
        console.warn('Storage mutation failed, will retry on next render:', error)
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [status, isStorageLoading, task, files, storageFiles, updateFiles, setActiveFile])

  // Update file list when files change
  useEffect(() => {
    if (storageFiles) {
      setFiles(storageFiles)
      setFileList(createFileTree(storageFiles))
    }
  }, [storageFiles])

  /**
   * Get content of a specific file
   */
  const getFileContent = (filePath: string): string => {
    return files[filePath] ?? ''
  }

  /**
   * Update content of a specific file
   */
  const updateFileContent = (filePath: string, content: string) => {
    const newFiles = { ...files, [filePath]: content }
    setFiles(newFiles)
    updateFiles(newFiles)
  }

  /**
   * Switch to a different file
   */
  const switchFile = (filePath: string) => {
    if (files[filePath] !== undefined) {
      setActiveFile(filePath)
    }
  }

  return {
    files,
    fileList,
    activeFile: activeFile ?? fileList[0] ?? null,
    getFileContent,
    updateFileContent,
    switchFile,
  }
}

