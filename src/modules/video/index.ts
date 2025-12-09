/**
 * Video module
 * 
 * This module handles video and voice integration via Jitsi Meet.
 * 
 * @module video
 */

// Components
export { JitsiVideo } from './components/JitsiVideo'
export { VideoControls } from './components/VideoControls'
export { FloatingVideoTile } from './components/FloatingVideoTile'
export { VideoGrid } from './components/VideoGrid'
export { ReactionButton, ReactionBar } from './components/ReactionButton'
export { ReactionAnimation } from './components/ReactionAnimation'
export { RaiseHandButton } from './components/RaiseHandButton'
export { RaiseHandNotification } from './components/RaiseHandNotification'

// Hooks
export { useJitsiCall } from './hooks/useJitsiCall'
export { useDraggable } from './hooks/useDraggable'
export { useScreenShare } from './hooks/useScreenShare'
export { useReactions } from './hooks/useReactions'
export { useRaiseHand } from './hooks/useRaiseHand'

// Types
export type {
  JitsiCallState,
  JitsiCallConfig,
  VideoParticipant,
  JitsiEventType,
  Reaction,
  // Deprecated - kept for backward compatibility
  DailyCallState,
  DailyCallConfig,
  DailyEventType,
} from './types'
export type { Position, DraggableConfig, UseDraggableReturn } from './hooks/useDraggable'
export type { ScreenShareState } from './hooks/useScreenShare'

