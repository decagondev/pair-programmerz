import { useMemo } from 'react'
import { usePhase } from './usePhase'

/**
 * Phase lock hook
 * 
 * Provides utilities to check phase-based UI restrictions.
 * Used to conditionally show/hide or enable/disable UI elements based on current phase.
 * 
 * @param roomId - Room ID
 * @returns Phase lock state and utilities
 */
export function usePhaseLock(roomId: string) {
  const { phase, isLoading } = usePhase(roomId)

  const isEditorLocked = useMemo(() => {
    if (!phase) return false
    // Editor is locked (hidden/read-only) in reflection and ended phases
    return phase === 'reflection' || phase === 'ended'
  }, [phase])

  const isDriverSwitchingLocked = useMemo(() => {
    if (!phase) return false
    // Driver switching is disabled in reflection and ended phases
    return phase === 'reflection' || phase === 'ended'
  }, [phase])

  const isCodingPhase = useMemo(() => {
    return phase === 'coding'
  }, [phase])

  const isReflectionPhase = useMemo(() => {
    return phase === 'reflection'
  }, [phase])

  const isEndedPhase = useMemo(() => {
    return phase === 'ended'
  }, [phase])

  const isTonePhase = useMemo(() => {
    return phase === 'tone'
  }, [phase])

  const canEditCode = useMemo(() => {
    if (!phase) return false
    // Can only edit code during coding phase
    return phase === 'coding'
  }, [phase])

  return {
    phase,
    isEditorLocked,
    isDriverSwitchingLocked,
    isCodingPhase,
    isReflectionPhase,
    isEndedPhase,
    isTonePhase,
    canEditCode,
    isLoading,
  }
}

