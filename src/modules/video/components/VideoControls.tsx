import { useState, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useJitsiCall } from '../hooks/useJitsiCall'
import { useScreenShare } from '../hooks/useScreenShare'
import { cn } from '@/lib/utils'

/**
 * Props for VideoControls component
 */
interface VideoControlsProps {
  /**
   * Room ID (Firestore room ID)
   */
  roomId: string | null
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Video controls component
 * 
 * Provides mic and camera toggle buttons for the Jitsi Meet video call.
 * Shows visual indicators for muted/off states.
 * 
 * @param props - Component props
 */
export function VideoControls({ roomId, className }: VideoControlsProps) {
  const { api, callState, setLocalAudio, setLocalVideo, participants } = useJitsiCall(roomId)
  const { isSharing, isAvailable, toggleScreenShare } = useScreenShare(api)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)

  // Update local state from Jitsi call
  useEffect(() => {
    if (!api || callState !== 'joined') {
      return
    }

    const updateState = () => {
      try {
        const localParticipant = participants.find((p) => p.isLocal)
        if (localParticipant) {
          setAudioEnabled(localParticipant.audioEnabled)
          setVideoEnabled(localParticipant.videoEnabled)
        } else {
          // Fallback to API methods
          setAudioEnabled(!api.isAudioMuted())
          setVideoEnabled(!api.isVideoMuted())
        }
      } catch (err) {
        console.error('Error updating video control state:', err)
      }
    }

    // Initial state
    updateState()

    // Listen for mute status changes
    const handleAudioMuteStatusChanged = () => {
      if (api) {
        setAudioEnabled(!api.isAudioMuted())
      }
    }

    const handleVideoMuteStatusChanged = () => {
      if (api) {
        setVideoEnabled(!api.isVideoMuted())
      }
    }

    api.addEventListener('audioMuteStatusChanged', handleAudioMuteStatusChanged)
    api.addEventListener('videoMuteStatusChanged', handleVideoMuteStatusChanged)

    return () => {
      try {
        api.removeEventListener('audioMuteStatusChanged', handleAudioMuteStatusChanged)
        api.removeEventListener('videoMuteStatusChanged', handleVideoMuteStatusChanged)
      } catch {
        // Ignore errors during cleanup
      }
    }
  }, [api, callState, participants])

  const toggleAudio = () => {
    const newState = !audioEnabled
    setLocalAudio(newState)
    setAudioEnabled(newState)
  }

  const toggleVideo = () => {
    const newState = !videoEnabled
    setLocalVideo(newState)
    setVideoEnabled(newState)
  }

  const handleScreenShare = async () => {
    await toggleScreenShare()
  }

  const isDisabled = !api || callState !== 'joined'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant={audioEnabled ? 'default' : 'destructive'}
        size="icon"
        onClick={toggleAudio}
        disabled={isDisabled}
        aria-label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {audioEnabled ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>
      <Button
        type="button"
        variant={videoEnabled ? 'default' : 'destructive'}
        size="icon"
        onClick={toggleVideo}
        disabled={isDisabled}
        aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {videoEnabled ? (
          <Video className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>
      {isAvailable && (
        <Button
          type="button"
          variant={isSharing ? 'default' : 'outline'}
          size="icon"
          onClick={handleScreenShare}
          disabled={isDisabled}
          aria-label={isSharing ? 'Stop screen share' : 'Start screen share'}
          title={isSharing ? 'Stop screen share' : 'Start screen share'}
        >
          <Monitor className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

