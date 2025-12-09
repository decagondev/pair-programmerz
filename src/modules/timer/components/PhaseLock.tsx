import { usePhaseLock } from '../hooks/usePhaseLock'
import type { ReactNode } from 'react'

/**
 * Props for PhaseLock component
 */
interface PhaseLockProps {
  /**
   * Room ID
   */
  roomId: string
  /**
   * Children to render when phase allows
   */
  children: ReactNode
  /**
   * Phases that allow rendering (if not provided, renders for all phases except locked ones)
   */
  allowedPhases?: Array<'waiting' | 'tone' | 'coding' | 'reflection' | 'ended'>
  /**
   * If true, renders children only when editor is NOT locked
   */
  whenEditorUnlocked?: boolean
  /**
   * If true, renders children only when driver switching is NOT locked
   */
  whenDriverSwitchingUnlocked?: boolean
  /**
   * Fallback content to show when phase locks the content
   */
  fallback?: ReactNode
}

/**
 * Phase lock wrapper component
 * 
 * Conditionally renders children based on phase restrictions.
 * Useful for showing/hiding UI elements based on interview phase.
 * 
 * @param props - Component props
 */
export function PhaseLock({
  roomId,
  children,
  allowedPhases,
  whenEditorUnlocked,
  whenDriverSwitchingUnlocked,
  fallback = null,
}: PhaseLockProps) {
  const {
    phase,
    isEditorLocked,
    isDriverSwitchingLocked,
    isLoading,
  } = usePhaseLock(roomId)

  // Don't render while loading
  if (isLoading) {
    return null
  }

  // Check allowed phases
  if (allowedPhases && phase && !allowedPhases.includes(phase)) {
    return <>{fallback}</>
  }

  // Check editor lock
  if (whenEditorUnlocked && isEditorLocked) {
    return <>{fallback}</>
  }

  // Check driver switching lock
  if (whenDriverSwitchingUnlocked && isDriverSwitchingLocked) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

