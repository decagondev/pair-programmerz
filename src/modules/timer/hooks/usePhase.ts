import { useMemo } from 'react'
import { useRoom } from '@/modules/room'
import type { RoomPhase } from '@/modules/room/types'
import { NEXT_PHASE, isValidPhaseTransition } from '../types'

/**
 * Phase management hook
 * 
 * Provides phase state and utilities for phase management.
 * Uses room data from Firestore as the single source of truth.
 * 
 * @param roomId - Room ID
 * @returns Phase state and utilities
 */
export function usePhase(roomId: string) {
  const { data: room, isLoading, error } = useRoom(roomId)

  const phase = useMemo<RoomPhase | null>(() => {
    return room?.phase ?? null
  }, [room?.phase])

  const nextPhase = useMemo<RoomPhase | null>(() => {
    if (!phase) return null
    return NEXT_PHASE[phase] ?? null
  }, [phase])

  const canAdvancePhase = useMemo(() => {
    if (!phase || !nextPhase) return false
    return isValidPhaseTransition(phase, nextPhase)
  }, [phase, nextPhase])

  const canEndEarly = useMemo(() => {
    if (!phase) return false
    return phase !== 'ended' && isValidPhaseTransition(phase, 'ended')
  }, [phase])

  const phaseStartedAt = useMemo(() => {
    return room?.phaseStartedAt ?? null
  }, [room?.phaseStartedAt])

  return {
    phase,
    nextPhase,
    canAdvancePhase,
    canEndEarly,
    phaseStartedAt,
    isLoading,
    error,
  }
}

