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
    // Wait for storage to be loaded and connected
    if (status !== 'connected' || isStorageLoading) {
      return
    }

    // Check if storage is actually available by checking if we can read from it
    // If storageFiles is still null/undefined, storage isn't ready yet
    if (storageFiles === null || storageFiles === undefined) {
      return
    }

    // If no task is assigned (custom interview), create a default empty file
    if (!task) {
      // Only create default file if storage is empty
      if (Object.keys(storageFiles).length === 0 && Object.keys(files).length === 0) {
        const defaultFiles = {
          'src/App.tsx': '// Custom interview\n// Start coding here...\n\n',
        }
        setFiles(defaultFiles)
        const timeoutId = setTimeout(() => {
          try {
            updateFiles(defaultFiles)
            setActiveFile('src/App.tsx')
          } catch (error) {
            console.error('Failed to save default files:', error)
          }
        }, 200)
        return () => clearTimeout(timeoutId)
      }
      return
    }

    // Check if storage is actually available by checking if we can read from it
    // If storageFiles is still null/undefined, storage isn't ready yet
    if (storageFiles === null || storageFiles === undefined) {
      return
    }

    // Check if files already exist in storage - if so, sync and don't overwrite
    const hasFilesInStorage = Object.keys(storageFiles).length > 0
    if (hasFilesInStorage) {
      // Files already exist in storage, sync local state if needed
      const storageKeys = Object.keys(storageFiles).sort().join(',')
      const localKeys = Object.keys(files).sort().join(',')
      if (storageKeys !== localKeys) {
        setFiles(storageFiles)
      }
      return
    }

    // Check if we've already loaded files locally (prevent duplicate loading)
    // Only check if we have actual content, not just empty object
    const hasFilesLocally = Object.keys(files).length > 0 && 
      Object.values(files).some(content => content && content.trim().length > 0)
    if (hasFilesLocally) {
      return
    }

    // Parse starter code from task
    const parsedFiles = parseStarterCode(task)
    
    // Validate that we have files to load
    if (Object.keys(parsedFiles).length === 0) {
      console.warn('No starter code found in task:', {
        taskId: task.id,
        title: task.title,
        hasStarterCode: !!task.starterCode,
        language: task.language,
      })
      return
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('Loading files from task:', {
        taskId: task.id,
        fileCount: Object.keys(parsedFiles).length,
        files: Object.keys(parsedFiles),
      })
    }

    // Update local state immediately for better UX
    setFiles(parsedFiles)
    
    // Update storage - use a delay to ensure storage is fully initialized
    const timeoutId = setTimeout(() => {
      try {
        updateFiles(parsedFiles)
        
        // Set first file as active
        const filePaths = createFileTree(parsedFiles)
        if (filePaths.length > 0) {
          setActiveFile(filePaths[0])
        }
      } catch (error) {
        // If storage still not ready, log error and retry
        console.error('Failed to save files to storage:', error)
        // Retry after a longer delay
        setTimeout(() => {
          try {
            updateFiles(parsedFiles)
            const filePaths = createFileTree(parsedFiles)
            if (filePaths.length > 0) {
              setActiveFile(filePaths[0])
            }
          } catch (retryError) {
            console.error('Retry failed to save files to storage:', retryError)
          }
        }, 500)
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [status, isStorageLoading, task, storageFiles, updateFiles, setActiveFile, files])

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

