import { JitsiVideo } from './JitsiVideo'
import { cn } from '@/lib/utils'

/**
 * Props for VideoGrid component
 */
interface VideoGridProps {
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
 * Video grid component
 * 
 * Container for Jitsi Meet video.
 * Uses JitsiVideo component which handles all video rendering via JitsiMeeting.
 * 
 * Note: Jitsi Meeting displays all participants in its own UI.
 * Floating tiles can be added as an overlay in the future if needed.
 * 
 * @param props - Component props
 */
export function VideoGrid({ roomId, className }: VideoGridProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <JitsiVideo roomId={roomId} className="h-full w-full" />
    </div>
  )
}

