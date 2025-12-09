import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import type { Room } from '@liveblocks/client'

/**
 * Initialize Yjs document with Liveblocks binding
 * 
 * Creates a Yjs document and binds it to Liveblocks storage for real-time synchronization.
 * 
 * @param room - Liveblocks room instance
 * @returns Yjs document and provider
 */
export function initializeYjsDocument(room: Room) {
  // Create Yjs document
  const yjsDoc = new Y.Doc()

  // Create Liveblocks provider to sync Yjs document with Liveblocks storage
  const provider = new LiveblocksYjsProvider(room, yjsDoc)

  return {
    yjsDoc,
    provider,
  }
}

/**
 * Get or create Yjs document from Liveblocks storage
 * 
 * Retrieves existing Yjs document from storage or creates a new one.
 * 
 * @param room - Liveblocks room instance
 * @returns Yjs document
 */
export function getYjsDocument(room: Room): Y.Doc {
  // For now, we'll create a new document each time
  // In the future, we might want to persist the document in Liveblocks storage
  const { yjsDoc } = initializeYjsDocument(room)
  return yjsDoc
}

