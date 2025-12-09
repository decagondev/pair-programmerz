import { createClient } from '@liveblocks/client'
import { env } from './env'

/**
 * Liveblocks client instance
 * 
 * This client is used for real-time collaboration features including:
 * - Presence (cursors, avatars)
 * - Storage (shared state)
 * - Yjs document synchronization
 * 
 * @example
 * ```typescript
 * import { liveblocksClient } from '@/modules/config'
 * const room = liveblocksClient.enter('room-id')
 * ```
 */
export const liveblocksClient = createClient({
  publicApiKey: env.VITE_LIVEBLOCKS_PUBLIC_KEY,
  // throttle: 100, // Optional: throttle presence updates
})

