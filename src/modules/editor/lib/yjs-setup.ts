import * as Y from 'yjs'
import * as awarenessProtocol from 'y-protocols/awareness'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import type { Room } from '@liveblocks/client'

// Store providers to reuse them
const providerCache = new Map<string, { yjsDoc: Y.Doc; provider: LiveblocksYjsProvider; awareness: awarenessProtocol.Awareness }>()

/**
 * Initialize Yjs document with Liveblocks binding
 * 
 * Creates a Yjs document and binds it to Liveblocks storage for real-time synchronization.
 * 
 * @param room - Liveblocks room instance
 * @returns Yjs document, provider, and awareness
 */
export function initializeYjsDocument(room: Room) {
  // Check if we already have a provider for this room
  const roomId = room.id
  if (providerCache.has(roomId)) {
    return providerCache.get(roomId)!
  }

  // Create Yjs document
  const yjsDoc = new Y.Doc()

  // Create Liveblocks provider to sync Yjs document with Liveblocks storage
  const provider = new LiveblocksYjsProvider(room, yjsDoc)

  // Create Yjs awareness for collaboration (cursors, selections)
  // Use awarenessProtocol.Awareness from y-protocols
  const awareness = new awarenessProtocol.Awareness(yjsDoc)

  const result = {
    yjsDoc,
    provider,
    awareness,
  }

  // Cache the provider
  providerCache.set(roomId, result)

  return result
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
  const { yjsDoc } = initializeYjsDocument(room)
  return yjsDoc
}

/**
 * Get Yjs awareness for collaboration
 * 
 * @param room - Liveblocks room instance
 * @returns Yjs awareness instance
 */
export function getYjsAwareness(room: Room): awarenessProtocol.Awareness {
  const { awareness } = initializeYjsDocument(room)
  return awareness
}

