import { useMutation, useQueryClient } from '@tanstack/react-query'
import { serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/modules/auth'
import { useRole } from '@/modules/auth'
import { updateRoom } from '@/lib/firebase/rooms'
import { usePhase } from './usePhase'
import type { RoomPhase } from '@/modules/room/types'
import { isValidPhaseTransition } from '../types'

/**
 * Phase transition input
 * 
 * Data for transitioning to a new phase.
 */
export interface PhaseTransitionInput {
  /** Target phase to transition to */
  phase: RoomPhase
}

/**
 * Hook for phase transitions
 * 
 * Allows interviewer to manually advance phases or end interview early.
 * Validates transitions and updates Firestore with new phase and timestamp.
 * 
 * @param roomId - Room ID
 * @returns Mutation object for phase transitions
 */
export function usePhaseTransition(roomId: string) {
  const { user } = useAuth()
  const { role } = useRole(roomId)
  const { phase: currentPhase } = usePhase(roomId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: PhaseTransitionInput) => {
      if (!user?.uid) {
        throw new Error('User must be authenticated to transition phases')
      }

      // Only interviewer (room creator) can transition phases
      if (role !== 'interviewer') {
        throw new Error('Only interviewer can transition phases')
      }

      if (!currentPhase) {
        throw new Error('Current phase not available')
      }

      const { phase: targetPhase } = input

      // Validate transition
      if (!isValidPhaseTransition(currentPhase, targetPhase)) {
        throw new Error(
          `Invalid phase transition: cannot transition from ${currentPhase} to ${targetPhase}`
        )
      }

      // Update room with new phase and phase start timestamp
      await updateRoom(roomId, {
        phase: targetPhase,
        phaseStartedAt: serverTimestamp(),
      })

      return {
        previousPhase: currentPhase,
        newPhase: targetPhase,
      }
    },
    onSuccess: () => {
      // Invalidate room query to refetch
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

