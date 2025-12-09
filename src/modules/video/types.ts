/**
 * Video module types
 * 
 * Type definitions for video and voice integration via Jitsi Meet.
 * 
 * @module video/types
 */

/**
 * Jitsi call state
 * 
 * Represents the current state of a Jitsi Meet video call.
 */
export type JitsiCallState = 'idle' | 'joining' | 'joined' | 'left' | 'error'

/**
 * @deprecated Use JitsiCallState instead
 */
export type DailyCallState = JitsiCallState

/**
 * Video participant
 * 
 * Represents a participant in the video call.
 */
export interface VideoParticipant {
  /** Participant user ID */
  userId: string
  /** Participant display name */
  displayName: string
  /** Participant role (interviewer or candidate) */
  role: 'interviewer' | 'candidate' | null
  /** Whether this is the local user */
  isLocal: boolean
  /** Whether participant's audio is enabled */
  audioEnabled: boolean
  /** Whether participant's video is enabled */
  videoEnabled: boolean
  /** Participant's session ID (Jitsi session ID) */
  sessionId: string
}

/**
 * Jitsi call configuration
 * 
 * Configuration options for joining a Jitsi Meet room.
 */
export interface JitsiCallConfig {
  /** Display name for the participant */
  displayName: string
  /** Whether to start with audio enabled */
  startWithAudioMuted?: boolean
  /** Whether to start with video enabled */
  startWithVideoMuted?: boolean
}

/**
 * @deprecated Use JitsiCallConfig instead
 */
export interface DailyCallConfig {
  url: string
  displayName: string
  startWithAudioMuted?: boolean
  startWithVideoMuted?: boolean
}

/**
 * Jitsi event types
 * 
 * Common Jitsi Meet event types for type safety.
 */
export type JitsiEventType =
  | 'videoConferenceJoined'
  | 'videoConferenceLeft'
  | 'participantJoined'
  | 'participantLeft'
  | 'audioMuteStatusChanged'
  | 'videoMuteStatusChanged'
  | 'screenSharingStatusChanged'
  | 'errorOccurred'
  | 'readyToClose'

/**
 * @deprecated Use JitsiEventType instead
 */
export type DailyEventType =
  | 'joined-meeting'
  | 'left-meeting'
  | 'participant-joined'
  | 'participant-left'
  | 'participant-updated'
  | 'error'
  | 'loading'

/**
 * Reaction data
 * 
 * Represents a reaction from a participant.
 * Compatible with Liveblocks Lson (JSON-like) format.
 */
export interface Reaction {
  /** User ID who triggered the reaction */
  userId: string
  /** Emoji for the reaction */
  emoji: string
  /** Timestamp when reaction was triggered */
  timestamp: number
  /** Unique ID for this reaction */
  id: string
  /** Index signature for Liveblocks compatibility */
  [key: string]: string | number
}

