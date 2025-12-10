import { lazy, Suspense } from 'react'
import { useJitsiCall } from '../hooks/useJitsiCall'
import { useAuth } from '@/modules/auth'
import { useUserStore } from '@/modules/store'
import { jitsiDomain, jitsiJaaSConfig, defaultJitsiConfig, defaultJitsiInterfaceConfig } from '@/modules/config'
import { cn } from '@/lib/utils'

// Lazy load Jitsi SDK to reduce initial bundle size
const JitsiMeeting = lazy(() => import('@jitsi/react-sdk').then(m => ({ default: m.JitsiMeeting })))

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
  
  // Get display name for Jitsi
  const { user } = useAuth()
  const { user: userState } = useUserStore()
  const displayName = userState.displayName || user?.displayName || 'Anonymous'

  // Sanitize room name for Jitsi to avoid lobby routing
  // For JaaS: room name must be in format {tenant}/{roomName}
  // For public Jitsi: use hash-based approach to avoid lobby routing
  const sanitizedRoomName = roomId
    ? (() => {
        if (jitsiJaaSConfig.isJaaS && jitsiJaaSConfig.tenant) {
          // JaaS requires tenant in room name: {tenant}/{roomName}
          // Create a simple hash of the room ID for a shorter, random-looking name
          let hash = 0
          for (let i = 0; i < roomId.length; i++) {
            const char = roomId.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash // Convert to 32-bit integer
          }
          const hashStr = Math.abs(hash).toString(36)
          return `${jitsiJaaSConfig.tenant}/pair-${hashStr}`
        } else {
          // Public Jitsi: use hash-based approach
          let hash = 0
          for (let i = 0; i < roomId.length; i++) {
            const char = roomId.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash // Convert to 32-bit integer
          }
          const hashStr = Math.abs(hash).toString(36)
          return `pair-${hashStr}`
        }
      })()
    : null

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
    const isMembersOnlyError = error.message.includes('membersOnly') || error.message.includes('lobby')
    const isJWTError = error.message.includes('JWT') || error.message.includes('jwt')
    
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-destructive/10 p-4', className)}>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Video call unavailable</p>
          {isJWTError || error.message.includes('tenant') ? (
            <>
              <p className="text-xs text-muted-foreground">
                JWT authentication error. Your JWT token is invalid or doesn't match your App ID.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Quick fix:</strong> Remove <code>VITE_JITSI_APP_ID</code> and <code>VITE_JITSI_JWT</code> from your <code>.env</code> file to use public Jitsi instead.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Or generate a valid JWT token server-side. See docs/JITSI_SETUP.md for details.
              </p>
            </>
          ) : isMembersOnlyError ? (
            <>
              <p className="text-xs text-muted-foreground">
                Video call requires authentication (members-only room).
              </p>
              {jitsiJaaSConfig.isJaaS ? (
                <p className="text-xs text-muted-foreground">
                  JaaS is configured but JWT token may be invalid. Check your JWT configuration.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Configure JaaS with a valid JWT token, or use a self-hosted Jitsi instance.
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">{error.message}</p>
          )}
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

  // Determine which domain to use
  // Only use JaaS (8x8.vc) if fully configured (both App ID and JWT)
  // Otherwise, fall back to public Jitsi to avoid lobby errors
  const effectiveDomain = jitsiJaaSConfig.isJaaS && !jitsiJaaSConfig.isPartiallyConfigured 
    ? '8x8.vc' 
    : jitsiDomain
  const shouldUseJaaS = jitsiJaaSConfig.isJaaS && !jitsiJaaSConfig.isPartiallyConfigured

  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg bg-black', className)}>
      {jitsiJaaSConfig.isPartiallyConfigured && (
        <div className="absolute top-2 left-2 right-2 z-10 rounded bg-yellow-500/90 p-2 text-xs text-yellow-900">
          <p className="font-medium">JaaS partially configured</p>
          <p>App ID found but JWT missing. Falling back to public Jitsi. Add JWT to use JaaS.</p>
        </div>
      )}
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Loading video...</p>
            </div>
          </div>
        }
      >
        <JitsiMeeting
          domain={effectiveDomain}
          roomName={sanitizedRoomName || roomId}
          userInfo={{
            displayName: displayName,
            email: user?.email || `${displayName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          }}
          // JWT is required for JaaS - only pass if we have both App ID and JWT
          {...(shouldUseJaaS && jitsiJaaSConfig.jwt ? { jwt: jitsiJaaSConfig.jwt } : {})}
          configOverwrite={{
            ...defaultJitsiConfig,
            startWithAudioMuted,
            startWithVideoMuted,
            // JaaS-specific config (only if fully configured)
            ...(shouldUseJaaS && {
              serviceName: '8x8.vc',
            }),
            // Ensure we bypass lobby
            enableLobbyChat: false,
            enablePrejoinPage: false,
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
      </Suspense>
    </div>
  )
}

