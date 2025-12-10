import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/modules/auth'
import { useUserStore } from '@/modules/store'
import type { JitsiCallState, JitsiCallConfig, VideoParticipant } from '../types'

/**
 * Jitsi External API type
 * 
 * Type definition for Jitsi Meet External API.
 */
export interface JitsiExternalAPI {
  executeCommand: (command: string, ...args: unknown[]) => void
  getParticipantsInfo: () => Array<{
    participantId: string
    displayName?: string
    isAudioMuted?: boolean
    isVideoMuted?: boolean
    isLocal?: boolean
  }>
  getDisplayName: () => string
  isAudioMuted: () => boolean
  isVideoMuted: () => boolean
  setAudioMute: (muted: boolean) => void
  setVideoMute: (muted: boolean) => void
  dispose: () => void
  addEventListener: (event: string, listener: (data?: unknown) => void) => void
  removeEventListener: (event: string, listener: (data?: unknown) => void) => void
  on: (event: string, listener: (data?: unknown) => void) => void
  off: (event: string, listener: (data?: unknown) => void) => void
}

/**
 * Jitsi call lifecycle hook
 * 
 * Manages Jitsi Meet video call instance, state, and participant tracking.
 * Handles joining/leaving, participant events, and cleanup.
 * 
 * @param roomId - Firestore room ID (used as Jitsi room name)
 * @param config - Optional call configuration
 * @returns Call state, instance, participants, and control functions
 */
export function useJitsiCall(
  _roomId: string | null,
  _config?: Partial<JitsiCallConfig>
) {
  const { user } = useAuth()
  const { user: userState } = useUserStore()
  const [callState, setCallState] = useState<JitsiCallState>('idle')
  const [api, setApi] = useState<JitsiExternalAPI | null>(null)
  const [participants, setParticipants] = useState<VideoParticipant[]>([])
  const [error, setError] = useState<Error | null>(null)
  const apiRef = useRef<JitsiExternalAPI | null>(null)

  // Get display name from user state or auth
  const displayName = userState.displayName || user?.displayName || 'Anonymous'

  /**
   * Update participants list from Jitsi call
   */
  const updateParticipants = useCallback((jitsiApi: JitsiExternalAPI) => {
    if (!jitsiApi) return

    try {
      const allParticipants = jitsiApi.getParticipantsInfo()

      const videoParticipants: VideoParticipant[] = allParticipants.map((participant) => {
        const isLocal = participant.isLocal ?? false
        return {
          userId: participant.participantId,
          displayName: participant.displayName || displayName,
          role: null, // Role will be determined from Firestore room data
          isLocal,
          audioEnabled: !(participant.isAudioMuted ?? false),
          videoEnabled: !(participant.isVideoMuted ?? false),
          sessionId: participant.participantId,
        }
      })

      setParticipants(videoParticipants)
    } catch (err) {
      console.error('Error updating participants:', err)
    }
  }, [displayName])

  /**
   * Handle API ready callback
   */
  const handleApiReady = useCallback((jitsiApi: JitsiExternalAPI) => {
    apiRef.current = jitsiApi
    setApi(jitsiApi)

    // Set up event listeners
    jitsiApi.addEventListener('videoConferenceJoined', () => {
      setCallState('joined')
      setError(null)
      updateParticipants(jitsiApi)
    })

    jitsiApi.addEventListener('videoConferenceLeft', () => {
      setCallState('left')
      setParticipants([])
    })

    jitsiApi.addEventListener('participantJoined', () => {
      updateParticipants(jitsiApi)
    })

    jitsiApi.addEventListener('participantLeft', () => {
      updateParticipants(jitsiApi)
    })

    jitsiApi.addEventListener('audioMuteStatusChanged', () => {
      updateParticipants(jitsiApi)
    })

    jitsiApi.addEventListener('videoMuteStatusChanged', () => {
      updateParticipants(jitsiApi)
    })

    jitsiApi.addEventListener('errorOccurred', (errorData) => {
      const errorMessage = (errorData as { error?: string })?.error || 'Unknown Jitsi error'
      setError(new Error(errorMessage))
      setCallState('error')
    })

    // Handle conference failed event (e.g., members-only/lobby errors, JWT errors)
    jitsiApi.addEventListener('conferenceFailed', (errorData) => {
      const errorInfo = errorData as { error?: string; message?: string }
      const errorMsg = errorInfo?.error || errorInfo?.message || 'Conference failed'
      
      // Check if it's a JWT error
      if (errorMsg.includes('JWT') || errorMsg.includes('jwt') || errorMsg.includes('tenant')) {
        setError(new Error('JWT authentication failed. Please check your JaaS configuration or remove it to use public Jitsi.'))
      } else if (errorMsg.includes('membersOnly') || errorMsg.includes('lobby')) {
        setError(new Error('Video call requires authentication. Please configure JaaS properly or use a custom Jitsi domain.'))
      } else {
        setError(new Error(`Video call failed: ${errorMsg}`))
      }
      setCallState('error')
    })

    jitsiApi.addEventListener('readyToClose', () => {
      setCallState('left')
      setParticipants([])
    })
  }, [updateParticipants])

  /**
   * Set local audio (mute/unmute)
   */
  const setLocalAudio = useCallback((enabled: boolean) => {
    if (!apiRef.current) {
      return
    }

    try {
      apiRef.current.setAudioMute(!enabled)
    } catch (err) {
      console.error('Error setting local audio:', err)
    }
  }, [])

  /**
   * Set local video (show/hide)
   */
  const setLocalVideo = useCallback((enabled: boolean) => {
    if (!apiRef.current) {
      return
    }

    try {
      apiRef.current.setVideoMute(!enabled)
    } catch (err) {
      console.error('Error setting local video:', err)
    }
  }, [])

  /**
   * Leave the Jitsi call
   */
  const leaveCall = useCallback(() => {
    if (!apiRef.current) {
      return
    }

    try {
      apiRef.current.executeCommand('hangup')
      setCallState('left')
      setParticipants([])
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to leave Jitsi call')
      setError(error)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.dispose()
        } catch {
          // Ignore errors during cleanup
        }
        apiRef.current = null
        setApi(null)
        setCallState('idle')
      }
    }
  }, [])

  return {
    api,
    callState,
    participants,
    error,
    onApiReady: handleApiReady,
    leaveCall,
    setLocalAudio,
    setLocalVideo,
  }
}

