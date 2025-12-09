/**
 * Timer module
 * 
 * This module handles interview phase management and timers.
 * 
 * @module timer
 */

// Components
export { TimerDisplay } from './components/TimerDisplay'
export { PhaseControls } from './components/PhaseControls'
export { PhaseLock } from './components/PhaseLock'

// Hooks
export { useTimer } from './hooks/useTimer'
export { usePhase } from './hooks/usePhase'
export { usePhaseTransition } from './hooks/usePhaseTransition'
export { usePhaseLock } from './hooks/usePhaseLock'

// Types
export type { TimerState, PhaseTransitionInput } from './types'
export { PHASE_DURATIONS, NEXT_PHASE, isValidPhaseTransition } from './types'

