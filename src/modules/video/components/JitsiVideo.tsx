import { JitsiMeeting } from '@jitsi/react-sdk'
import { useJitsiCall } from '../hooks/useJitsiCall'
import { jitsiDomain, defaultJitsiConfig, defaultJitsiInterfaceConfig } from '@/modules/config'
import { cn } from '@/lib/utils'

/**
 * Props for JitsiVideo component
 */
interface JitsiVideoProps {
  /**
   * Room ID (Firestore room ID, used as Jitsi room name)
   */
  roomId: string | null
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to start with audio muted
   */
  startWithAudioMuted?: boolean
  /**
   * Whether to start with video muted
   */
  startWithVideoMuted?: boolean
}

/**
 * Jitsi Meet video component
 * 
 * Main video component using Jitsi Meet's React SDK.
 * Auto-joins the video call when mounted and handles cleanup on unmount.
 * 
 * @param props - Component props
 */
export function JitsiVideo({
  roomId,
  className,
  startWithAudioMuted = false,
  startWithVideoMuted = false,
}: JitsiVideoProps) {
  const { callState, error, onApiReady } = useJitsiCall(roomId, {
    startWithAudioMuted,
    startWithVideoMuted,
  })

  // Wrap onApiReady to match Jitsi's expected type
  const handleApiReady = (api: unknown) => {
    // Map Jitsi API to our interface
    const jitsiApi = api as {
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
      dispose: () => void
      addEventListener: (event: string, listener: (data?: unknown) => void) => void
      removeEventListener: (event: string, listener: (data?: unknown) => void) => void
    }
    
    const mappedApi = {
      executeCommand: jitsiApi.executeCommand.bind(jitsiApi),
      getParticipantsInfo: jitsiApi.getParticipantsInfo.bind(jitsiApi),
      getDisplayName: jitsiApi.getDisplayName.bind(jitsiApi),
      isAudioMuted: jitsiApi.isAudioMuted.bind(jitsiApi),
      isVideoMuted: jitsiApi.isVideoMuted.bind(jitsiApi),
      setAudioMute: () => jitsiApi.executeCommand('toggleAudio'),
      setVideoMute: () => jitsiApi.executeCommand('toggleVideo'),
      dispose: jitsiApi.dispose.bind(jitsiApi),
      addEventListener: jitsiApi.addEventListener.bind(jitsiApi),
      removeEventListener: jitsiApi.removeEventListener.bind(jitsiApi),
      on: jitsiApi.addEventListener.bind(jitsiApi),
      off: jitsiApi.removeEventListener.bind(jitsiApi),
    }
    onApiReady(mappedApi)
  }

  if (!roomId) {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-muted p-4', className)}>
        <p className="text-sm text-muted-foreground">No room ID provided</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-destructive/10 p-4', className)}>
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">Video call error</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (callState === 'joining') {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-muted p-4', className)}>
        <div className="text-center">
          <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Joining video call...</p>
        </div>
      </div>
    )
  }

  if (callState === 'left') {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-muted p-4', className)}>
        <p className="text-sm text-muted-foreground">Left video call</p>
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-black', className)}>
      <JitsiMeeting
        domain={jitsiDomain}
        roomName={roomId}
        configOverwrite={{
          ...defaultJitsiConfig,
          startWithAudioMuted,
          startWithVideoMuted,
        }}
        interfaceConfigOverwrite={defaultJitsiInterfaceConfig}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          if (iframeRef) {
            iframeRef.style.height = '100%'
            iframeRef.style.width = '100%'
            iframeRef.style.border = 'none'
          }
        }}
      />
    </div>
  )
}

