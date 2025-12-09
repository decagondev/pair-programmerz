import type { RoomPhase } from '@/modules/room/types'

/**
 * Phase duration in minutes
 * 
 * Defines how long each interview phase should last.
 */
export const PHASE_DURATIONS: Record<RoomPhase, number> = {
  waiting: 0, // No timer for waiting phase
  tone: 5, // 5 minutes for set tone phase
  coding: 45, // 45 minutes for coding phase
  reflection: 10, // 10 minutes for reflection phase
  ended: 0, // No timer for ended phase
} as const

/**
 * Timer state
 * 
 * Represents the current state of the timer.
 */
export interface TimerState {
  /** Remaining time in milliseconds */
  remainingMs: number
  /** Remaining time in seconds */
  remainingSeconds: number
  /** Remaining time in minutes */
  remainingMinutes: number
  /** Total duration of current phase in milliseconds */
  totalDurationMs: number
  /** Whether the timer has expired */
  isExpired: boolean
  /** Whether the timer is in warning state (< 5 minutes) */
  isWarning: boolean
  /** Whether the timer is in critical state (< 2 minutes) */
  isCritical: boolean
  /** Current phase */
  phase: RoomPhase
}

/**
 * Phase transition input
 * 
 * Data required to transition to a new phase.
 */
export interface PhaseTransitionInput {
  /** Target phase to transition to */
  phase: RoomPhase
  /** Timestamp when phase started (server timestamp) */
  phaseStartedAt: ReturnType<typeof import('firebase/firestore').serverTimestamp>
}

/**
 * Next phase mapping
 * 
 * Defines the valid next phase for each current phase.
 */
export const NEXT_PHASE: Record<RoomPhase, RoomPhase | null> = {
  waiting: 'tone',
  tone: 'coding',
  coding: 'reflection',
  reflection: 'ended',
  ended: null, // No next phase after ended
} as const

/**
 * Check if a phase transition is valid
 * 
 * @param currentPhase - Current phase
 * @param targetPhase - Target phase to transition to
 * @returns True if transition is valid
 */
export function isValidPhaseTransition(
  currentPhase: RoomPhase,
  targetPhase: RoomPhase
): boolean {
  // Can't transition to the same phase
  if (currentPhase === targetPhase) {
    return false
  }

  // Can't go backwards (except from ended, which shouldn't happen)
  const phaseOrder: RoomPhase[] = ['waiting', 'tone', 'coding', 'reflection', 'ended']
  const currentIndex = phaseOrder.indexOf(currentPhase)
  const targetIndex = phaseOrder.indexOf(targetPhase)

  if (currentIndex === -1 || targetIndex === -1) {
    return false
  }

  // Can only advance to next phase or end early
  // Allow skipping ahead to 'ended' from any phase (for early termination)
  if (targetPhase === 'ended') {
    return true
  }

  // Otherwise, must be advancing forward
  return targetIndex > currentIndex
}

