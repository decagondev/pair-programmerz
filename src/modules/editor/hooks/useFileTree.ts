import { useEffect, useState } from 'react'
import { useStorage, useMutation } from '@liveblocks/react'
import { useRoom } from '@/modules/room'
import { getTaskById } from '@/data/sampleTasks'
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
  
  // Get files from Liveblocks storage
  const storageFiles = useStorage((root) => {
    const files = (root as { files?: Record<string, string> }).files
    return files ?? {}
  })

  // Get active file from storage
  const activeFile = useStorage((root) => {
    return (root as { activeFile?: string }).activeFile ?? null
  })

  // Local state for file list
  const [files, setFiles] = useState<Record<string, string>>(storageFiles ?? {})
  const [fileList, setFileList] = useState<string[]>([])

  // Mutation to update files in storage
  const updateFiles = useMutation(({ storage }, newFiles: Record<string, string>) => {
    storage.set('files', newFiles)
  }, [])

  // Mutation to set active file
  const setActiveFile = useMutation(({ storage }, filePath: string | null) => {
    storage.set('activeFile', filePath)
  }, [])

  // Load starter code when room task is available
  useEffect(() => {
    if (!room?.taskId || Object.keys(files).length > 0) {
      return
    }

    const task = getTaskById(room.taskId)
    if (task) {
      const parsedFiles = parseStarterCode(task)
      setFiles(parsedFiles)
      updateFiles(parsedFiles)
      
      // Set first file as active
      const filePaths = createFileTree(parsedFiles)
      if (filePaths.length > 0) {
        setActiveFile(filePaths[0])
      }
    }
  }, [room?.taskId, files, updateFiles, setActiveFile])

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

