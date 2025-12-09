import { useState, useEffect, useCallback } from 'react'
import type { JitsiExternalAPI } from './useJitsiCall'

/**
 * Screen share state
 */
export interface ScreenShareState {
  /** Whether screen is currently being shared */
  isSharing: boolean
  /** Whether screen share is available */
  isAvailable: boolean
  /** Error message if screen share fails */
  error: string | null
}

/**
 * Screen share hook
 * 
 * Manages screen sharing functionality using Jitsi Meet's native screen share.
 * 
 * @param api - Jitsi External API instance
 * @returns Screen share state and control functions
 */
export function useScreenShare(api: JitsiExternalAPI | null) {
  const [state, setState] = useState<ScreenShareState>({
    isSharing: false,
    isAvailable: false,
    error: null,
  })

  /**
   * Check if screen share is available
   */
  const checkAvailability = useCallback(() => {
    if (!api) {
      setState((prev) => ({ ...prev, isAvailable: false }))
      return
    }

    try {
      // Jitsi supports screen share natively
      // Check if browser supports getDisplayMedia
      const isAvailable = typeof navigator !== 'undefined' &&
        navigator.mediaDevices !== undefined &&
        navigator.mediaDevices.getDisplayMedia !== undefined

      setState((prev) => ({ ...prev, isAvailable }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isAvailable: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [api])

  /**
   * Start screen sharing
   */
  const startScreenShare = useCallback(async () => {
    if (!api || !state.isAvailable) {
      return
    }

    try {
      setState((prev) => ({ ...prev, error: null }))
      api.executeCommand('toggleShareScreen')
      setState((prev) => ({ ...prev, isSharing: true }))
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to start screen share'
      setState((prev) => ({
        ...prev,
        isSharing: false,
        error,
      }))
    }
  }, [api, state.isAvailable])

  /**
   * Stop screen sharing
   */
  const stopScreenShare = useCallback(async () => {
    if (!api) {
      return
    }

    try {
      api.executeCommand('toggleShareScreen')
      setState((prev) => ({ ...prev, isSharing: false, error: null }))
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to stop screen share'
      setState((prev) => ({
        ...prev,
        error,
      }))
    }
  }, [api])

  /**
   * Toggle screen sharing
   */
  const toggleScreenShare = useCallback(async () => {
    if (state.isSharing) {
      await stopScreenShare()
    } else {
      await startScreenShare()
    }
  }, [state.isSharing, startScreenShare, stopScreenShare])

  // Check availability when call changes
  useEffect(() => {
    checkAvailability()
  }, [checkAvailability])

  // Listen for screen share events
  useEffect(() => {
    if (!api) return

    const handleScreenShareStatusChanged = (data: unknown) => {
      const status = (data as { on?: boolean })?.on
      if (status !== undefined) {
        setState((prev) => ({ ...prev, isSharing: status, error: null }))
      }
    }

    api.addEventListener('screenSharingStatusChanged', handleScreenShareStatusChanged)

    return () => {
      try {
        api.removeEventListener('screenSharingStatusChanged', handleScreenShareStatusChanged)
      } catch {
        // Ignore errors during cleanup
      }
    }
  }, [api])

  return {
    ...state,
    startScreenShare,
    stopScreenShare,
    toggleScreenShare,
  }
}

