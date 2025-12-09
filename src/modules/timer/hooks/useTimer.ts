import { useEffect, useState, useRef } from 'react'
import { usePhase } from './usePhase'
import { calculateRemainingTime, formatTime } from '../lib/timerUtils'
import { playWarningAlert, playCriticalAlert, playExpiredAlert } from '../lib/soundAlerts'
import type { TimerState } from '../types'

/**
 * Timer hook
 * 
 * Calculates and updates timer state based on phase start timestamp.
 * Handles sound alerts at 5 min, 2 min, and 0 min remaining.
 * Updates every second for accurate countdown.
 * 
 * @param roomId - Room ID
 * @returns Timer state and formatted time string
 */
export function useTimer(roomId: string) {
  const { phase, phaseStartedAt, isLoading } = usePhase(roomId)
  const [timerState, setTimerState] = useState<TimerState | null>(null)
  const [formattedTime, setFormattedTime] = useState<string>('00:00')

  // Track which alerts have been played to avoid duplicates
  const alertsPlayedRef = useRef({
    warning: false,
    critical: false,
    expired: false,
  })

  // Reset alerts when phase changes
  useEffect(() => {
    alertsPlayedRef.current = {
      warning: false,
      critical: false,
      expired: false,
    }
  }, [phase])

  // Calculate timer state
  useEffect(() => {
    if (isLoading || !phase) {
      setTimerState(null)
      setFormattedTime('00:00')
      return
    }

    // Only show timer for active phases
    const activePhases = ['tone', 'coding', 'reflection']
    if (!activePhases.includes(phase)) {
      setTimerState(null)
      setFormattedTime('00:00')
      return
    }

    // Calculate remaining time
    const state = calculateRemainingTime(phase, phaseStartedAt)
    setTimerState(state)
    setFormattedTime(formatTime(state.remainingSeconds))

    // Play sound alerts
    if (state.isExpired && !alertsPlayedRef.current.expired) {
      playExpiredAlert()
      alertsPlayedRef.current.expired = true
    } else if (state.isCritical && !alertsPlayedRef.current.critical) {
      playCriticalAlert()
      alertsPlayedRef.current.critical = true
    } else if (state.isWarning && !alertsPlayedRef.current.warning) {
      playWarningAlert()
      alertsPlayedRef.current.warning = true
    }
  }, [phase, phaseStartedAt, isLoading])

  // Update timer every second
  useEffect(() => {
    if (!timerState || timerState.isExpired) {
      return
    }

    const interval = setInterval(() => {
      if (!phase || !phaseStartedAt) {
        return
      }

      const activePhases = ['tone', 'coding', 'reflection']
      if (!activePhases.includes(phase)) {
        return
      }

      const state = calculateRemainingTime(phase, phaseStartedAt)
      setTimerState(state)
      setFormattedTime(formatTime(state.remainingSeconds))

      // Play sound alerts
      if (state.isExpired && !alertsPlayedRef.current.expired) {
        playExpiredAlert()
        alertsPlayedRef.current.expired = true
      } else if (state.isCritical && !alertsPlayedRef.current.critical) {
        playCriticalAlert()
        alertsPlayedRef.current.critical = true
      } else if (state.isWarning && !alertsPlayedRef.current.warning) {
        playWarningAlert()
        alertsPlayedRef.current.warning = true
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [timerState, phase, phaseStartedAt])

  return {
    timerState,
    formattedTime,
    isLoading,
  }
}

