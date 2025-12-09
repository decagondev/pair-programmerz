import type { ReactNode } from 'react'
import { RoomProvider } from '@liveblocks/react'
import type { EditorPresence } from '../types'

/**
 * Props for LiveblocksRoomProvider
 */
interface LiveblocksRoomProviderProps {
  /**
   * Room ID (from Firestore room document)
   */
  roomId: string
  /**
   * User's display name
   */
  displayName: string
  /**
   * User's role (interviewer or candidate)
   */
  role: 'interviewer' | 'candidate' | null
  /**
   * User's avatar URL (optional)
   */
  avatar?: string
  /**
   * Child components
   */
  children: ReactNode
}

/**
 * Liveblocks room provider component
 * 
 * Wraps the editor with Liveblocks room context, providing real-time collaboration.
 * Initializes presence with user metadata (name, role, avatar).
 * 
 * @param props - Component props
 */
export function LiveblocksRoomProvider({
  roomId,
  displayName,
  role,
  avatar,
  children,
}: LiveblocksRoomProviderProps) {
  const initialPresence: EditorPresence = {
    name: displayName,
    role: role ?? null,
    avatar,
    isTyping: false,
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={initialPresence as any}
    >
      {children}
    </RoomProvider>
  )
}

