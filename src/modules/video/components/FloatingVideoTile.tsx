import { useDraggable, type Position } from '../hooks/useDraggable'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { VideoParticipant } from '../types'

/**
 * Props for FloatingVideoTile component
 */
interface FloatingVideoTileProps {
  /**
   * Video participant
   */
  participant: VideoParticipant
  /**
   * Initial position
   */
  initialPosition?: Position
  /**
   * Whether tile is draggable
   */
  draggable?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Video iframe element (for participant video)
   * Note: Jitsi handles video rendering internally, this is kept for compatibility
   */
  iframe?: HTMLIFrameElement | null
  /**
   * Z-index for tile stacking
   */
  zIndex?: number
  /**
   * Callback when tile is clicked (brings to front)
   */
  onFocus?: () => void
}

/**
 * Floating video tile component
 * 
 * Individual draggable video tile for a participant.
 * Shows participant video, name, role badge, and drag functionality.
 * 
 * @param props - Component props
 */
export function FloatingVideoTile({
  participant,
  initialPosition = { x: 0, y: 0 },
  draggable = true,
  className,
  iframe,
  zIndex = 1,
  onFocus,
}: FloatingVideoTileProps) {
  const { position, isDragging, handlers, ref } = useDraggable({
    initialPosition,
    enabled: draggable,
    bounds: {
      minX: 0,
      minY: 0,
      // Max bounds will be set based on viewport
    },
  })


  const handleClick = () => {
    if (onFocus) {
      onFocus()
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex flex-col overflow-hidden rounded-lg border-2 bg-background shadow-lg transition-shadow',
        isDragging && 'shadow-xl',
        className
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: '150px',
        zIndex,
        cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      {...(draggable ? handlers : {})}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Video tile for ${participant.displayName}`}
    >
      {/* Video container */}
      <div className="relative flex-1 bg-black">
        {iframe && participant.isLocal ? (
          <div
            className="h-full w-full"
            ref={(el) => {
              if (el && iframe && !el.contains(iframe)) {
                el.appendChild(iframe)
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-2xl text-muted-foreground">
              {participant.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Audio/video status indicators */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {!participant.audioEnabled && (
            <div className="rounded-full bg-destructive p-1">
              <span className="text-xs text-destructive-foreground">🔇</span>
            </div>
          )}
          {!participant.videoEnabled && (
            <div className="rounded-full bg-muted p-1">
              <span className="text-xs text-muted-foreground">📹</span>
            </div>
          )}
        </div>
      </div>
      {/* Participant info */}
      <div className="flex items-center justify-between border-t bg-muted/50 p-2">
        <div className="flex items-center gap-1">
          <Badge variant={participant.role === 'interviewer' ? 'default' : 'secondary'}>
            {participant.displayName}
          </Badge>
          {participant.isLocal && (
            <span className="text-xs text-muted-foreground">(You)</span>
          )}
        </div>
      </div>
    </div>
  )
}

