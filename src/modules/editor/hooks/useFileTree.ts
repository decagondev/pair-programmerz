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
  const { data: task, isLoading: taskLoading, error: taskError } = useTask(room?.taskId ?? null)
  const status = useStatus()
  
  // Get files from Liveblocks storage
  // Note: useStorage returns null when storage is not ready, or the value when ready
  const storageFiles = useStorage((root) => {
    if (!root) return null
    const files = (root as { files?: Record<string, string> }).files
    return files ?? {}
  })

  // Get active file from storage
  const activeFile = useStorage((root) => {
    if (!root) return null
    return (root as { activeFile?: string }).activeFile ?? null
  })
  
  // Check if storage is loading
  // useStorage returns null when storage is not ready
  // We also check if root exists by checking if we can access the storage structure
  const isStorageLoading = storageFiles === null || status !== 'connected'

  // Local state for file list
  const [files, setFiles] = useState<Record<string, string>>(storageFiles ?? {})
  const [fileList, setFileList] = useState<string[]>([])

  // Mutation to update files in storage
  const updateFiles = useMutation(({ storage }, newFiles: Record<string, string>) => {
    if (!storage) {
      console.error('[useFileTree] Storage not available in mutation')
      throw new Error('Storage not available')
    }
    
    console.log('[useFileTree] Mutation: Setting files in storage', {
      fileCount: Object.keys(newFiles).length,
      files: Object.keys(newFiles),
      storageAvailable: !!storage,
    })
    
    try {
      storage.set('files', newFiles)
      
      // Verify the write worked
      const writtenFiles = storage.get('files')
      console.log('[useFileTree] Mutation: Files set successfully', {
        writtenFileCount: writtenFiles ? Object.keys(writtenFiles).length : 0,
        writtenFiles: writtenFiles ? Object.keys(writtenFiles) : [],
      })
    } catch (error) {
      console.error('[useFileTree] Mutation: Error setting files', error)
      throw error
    }
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
    // Debug logging
    console.log('[useFileTree] Effect triggered:', {
      status,
      isStorageLoading,
      hasStorageFiles: storageFiles !== null && storageFiles !== undefined,
      storageFileCount: storageFiles ? Object.keys(storageFiles).length : 0,
      hasTask: !!task,
      taskId: room?.taskId,
      taskLoading,
      taskError: !!taskError,
      localFileCount: Object.keys(files).length,
    })

    // Wait for storage to be loaded and connected
    if (status !== 'connected' || isStorageLoading) {
      console.log('[useFileTree] Waiting for storage connection...')
      return
    }

    // Check if storage is actually available by checking if we can read from it
    // If storageFiles is still null/undefined, storage isn't ready yet
    if (storageFiles === null || storageFiles === undefined) {
      console.log('[useFileTree] Storage not ready yet (null/undefined)')
      return
    }

    // Wait for task to finish loading (if there's a taskId)
    if (room?.taskId && taskLoading) {
      return
    }

    // If no task is assigned (custom interview), create a default empty file
    if (!room?.taskId) {
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

    // If task is still loading, wait
    if (taskLoading) {
      return
    }

    // If task failed to load but taskId exists, create default file
    if (taskError) {
      console.error('Failed to load task:', taskError)
      // Still create a default file so user can code
      if (Object.keys(storageFiles).length === 0 && Object.keys(files).length === 0) {
        const defaultFiles = {
          'src/App.tsx': `// Task failed to load (${room.taskId})\n// Start coding here...\n\n`,
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

    // If taskId exists but task is null (not found), create default file
    if (!task) {
      // Task might not exist - create default file
      if (Object.keys(storageFiles).length === 0 && Object.keys(files).length === 0) {
        const defaultFiles = {
          'src/App.tsx': `// Task not found (${room.taskId})\n// Start coding here...\n\n`,
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

    // Debug logging (always enabled to help debug production issues)
    console.log('[useFileTree] Loading files from task:', {
      taskId: task.id,
      title: task.title,
      fileCount: Object.keys(parsedFiles).length,
      files: Object.keys(parsedFiles),
      hasStarterCode: !!task.starterCode,
      language: task.language,
    })

    // Update local state immediately for better UX
    setFiles(parsedFiles)
    
    // Update storage - use a delay to ensure storage is fully initialized
    const timeoutId = setTimeout(() => {
      try {
        console.log('[useFileTree] Attempting to save files to storage:', {
          fileCount: Object.keys(parsedFiles).length,
          files: Object.keys(parsedFiles),
        })
        
        updateFiles(parsedFiles)
        
        // Set first file as active
        const filePaths = createFileTree(parsedFiles)
        if (filePaths.length > 0) {
          setActiveFile(filePaths[0])
        }
        
        console.log('[useFileTree] Successfully saved files to storage')
      } catch (error) {
        // If storage still not ready, log error and retry
        console.error('[useFileTree] Failed to save files to storage:', error)
        // Retry after a longer delay
        setTimeout(() => {
          try {
            console.log('[useFileTree] Retrying to save files to storage...')
            updateFiles(parsedFiles)
            const filePaths = createFileTree(parsedFiles)
            if (filePaths.length > 0) {
              setActiveFile(filePaths[0])
            }
            console.log('[useFileTree] Retry successful')
          } catch (retryError) {
            console.error('[useFileTree] Retry failed to save files to storage:', retryError)
          }
        }, 500)
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [status, isStorageLoading, task, taskLoading, taskError, room?.taskId, storageFiles, updateFiles, setActiveFile, files])

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

