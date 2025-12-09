import type { Timestamp } from 'firebase/firestore'

/**
 * Room phase type
 * 
 * Represents the current phase of an interview room.
 */
export type RoomPhase = 'waiting' | 'tone' | 'coding' | 'reflection' | 'ended'

/**
 * Room status type
 * 
 * Computed status based on phase.
 */
export type RoomStatus = 'active' | 'finished'

/**
 * Room document interface
 * 
 * Represents a room document in Firestore.
 * This is the complete schema for rooms collection.
 */
export interface RoomDocument {
  /** Interviewer UID who created the room */
  createdBy: string
  /** Array of participant UIDs (candidates) */
  participants: string[]
  /** Selected task ID (null for custom tasks) */
  taskId: string | null
  /** Current interview phase */
  phase: RoomPhase
  /** Room status (computed: active if phase != 'ended', finished if phase == 'ended') */
  status: RoomStatus
  /** Room creation timestamp */
  createdAt: Timestamp
  /** Last update timestamp */
  updatedAt: Timestamp
  /** Generated magic link token for candidate join (optional) */
  magicLinkToken?: string
  /** Magic link token expiration timestamp (optional) */
  magicLinkExpiresAt?: Timestamp
  /** Jitsi Meet room URL (optional, deprecated - room name is derived from room ID) */
  dailyRoomUrl?: string
  /** Timestamp when current phase started (used for timer calculations) */
  phaseStartedAt?: Timestamp
}

/**
 * Room document with ID
 * 
 * Room document including the document ID.
 */
export interface RoomDocumentWithId extends RoomDocument {
  id: string
}

/**
 * Create room input
 * 
 * Data required to create a new room.
 */
export interface CreateRoomInput {
  taskId: string | null
  createdBy: string
}

/**
 * Update room input
 * 
 * Partial data for updating a room.
 */
import type { FieldValue } from 'firebase/firestore'

export interface UpdateRoomInput {
  phase?: RoomPhase
  participants?: string[]
  taskId?: string | null
  magicLinkToken?: string
  magicLinkExpiresAt?: Timestamp
  dailyRoomUrl?: string
  phaseStartedAt?: Timestamp | FieldValue
}

