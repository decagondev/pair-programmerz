import type { Timestamp } from 'firebase/firestore'
import type { RoomPhase } from '@/modules/room/types'
import { PHASE_DURATIONS, type TimerState } from '../types'

/**
 * Get phase duration in milliseconds
 * 
 * @param phase - Room phase
 * @returns Phase duration in milliseconds
 */
export function getPhaseDurationMs(phase: RoomPhase): number {
  const durationMinutes = PHASE_DURATIONS[phase]
  return durationMinutes * 60 * 1000
}

/**
 * Calculate remaining time for current phase
 * 
 * Calculates remaining time based on phase start timestamp and current time.
 * Uses server timestamp if available, otherwise falls back to client time.
 * 
 * @param phase - Current phase
 * @param phaseStartedAt - Timestamp when phase started (from Firestore)
 * @param serverTimeOffset - Optional server time offset to handle clock skew
 * @returns Timer state with remaining time
 */
export function calculateRemainingTime(
  phase: RoomPhase,
  phaseStartedAt: Timestamp | null | undefined,
  serverTimeOffset: number = 0
): TimerState {
  const totalDurationMs = getPhaseDurationMs(phase)

  // If no phase start timestamp, assume phase just started
  if (!phaseStartedAt) {
    return {
      remainingMs: totalDurationMs,
      remainingSeconds: Math.floor(totalDurationMs / 1000),
      remainingMinutes: Math.floor(totalDurationMs / 60000),
      totalDurationMs,
      isExpired: false,
      isWarning: false,
      isCritical: false,
      phase,
    }
  }

  // Calculate elapsed time
  // Use server timestamp if available, otherwise use client time with offset
  const phaseStartMs = phaseStartedAt.toMillis()
  const currentTimeMs = Date.now() + serverTimeOffset
  const elapsedMs = currentTimeMs - phaseStartMs

  // Calculate remaining time
  const remainingMs = Math.max(0, totalDurationMs - elapsedMs)
  const remainingSeconds = Math.floor(remainingMs / 1000)
  const remainingMinutes = Math.floor(remainingMs / 60000)

  // Determine timer states
  const isExpired = remainingMs === 0
  const isWarning = remainingMinutes < 5 && !isExpired
  const isCritical = remainingMinutes < 2 && !isExpired

  return {
    remainingMs,
    remainingSeconds,
    remainingMinutes,
    totalDurationMs,
    isExpired,
    isWarning,
    isCritical,
    phase,
  }
}

/**
 * Format time as MM:SS
 * 
 * @param remainingSeconds - Remaining time in seconds
 * @returns Formatted time string (MM:SS)
 */
export function formatTime(remainingSeconds: number): string {
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

