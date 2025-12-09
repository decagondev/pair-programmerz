import { useDriver } from '../hooks/useDriver'
import { usePresence } from '../hooks/usePresence'
import { useAuth } from '@/modules/auth'
import { cn } from '@/lib/utils'

/**
 * Props for DriverIndicator component
 */
interface DriverIndicatorProps {
  /**
   * Room ID (for role detection)
   */
  roomId: string | null
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Driver indicator component
 * 
 * Displays a large banner showing whether the current user is driving or navigating.
 * Shows current driver name and visual styling (green for driver, gray for navigator).
 * 
 * @param props - Component props
 */
export function DriverIndicator({ roomId, className }: DriverIndicatorProps) {
  const { isDriver, driverId } = useDriver(roomId)
  const { self } = usePresence()
  const { user } = useAuth()

  // Find driver's presence info by matching user ID
  // Note: We'll need to store user ID in presence for this to work properly
  // For now, we'll show the driver ID or "Someone"
  const driverName = driverId
    ? (driverId === user?.uid ? self?.name ?? 'You' : 'Someone')
    : 'No one'

  return (
    <div
      className={cn(
        'flex items-center justify-center border-b px-4 py-3',
        isDriver ? 'bg-green-500/10 border-green-500/20' : 'bg-muted border-border',
        className
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={isDriver ? 'You are currently driving' : 'You are currently navigating'}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-3 w-3 rounded-full',
            isDriver ? 'bg-green-500' : 'bg-muted-foreground'
          )}
        />
        <span className="text-sm font-medium">
          {isDriver ? 'You are Driving' : 'You are Navigating'}
        </span>
        {driverId && (
          <span className="text-xs text-muted-foreground">
            ({driverName} is driving)
          </span>
        )}
      </div>
    </div>
  )
}

