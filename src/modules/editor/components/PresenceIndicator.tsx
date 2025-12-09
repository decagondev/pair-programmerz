import { usePresence } from '../hooks/usePresence'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Presence indicator component
 * 
 * Displays an avatar stack showing all connected users in the room.
 * Shows user names, roles, and visual indicator for current driver.
 * 
 * @param driverId - Current driver's user ID (optional)
 */
interface PresenceIndicatorProps {
  driverId?: string | null
  roomId?: string | null
}

export function PresenceIndicator({ driverId }: PresenceIndicatorProps) {
  const { self, others } = usePresence()

  const allUsers = [
    ...(self ? [{ ...self, isSelf: true }] : []),
    ...others.map((other) => ({ ...other, isSelf: false })),
  ]

  if (allUsers.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {allUsers.map((user, index) => {
          const isDriver = user.role && driverId
            ? (user.isSelf ? driverId === 'self' : false) // We'll need to pass actual user ID
            : false

          return (
            <div
              key={user.isSelf ? 'self' : `other-${index}`}
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium',
                isDriver && 'ring-2 ring-green-500'
              )}
              title={`${user.name}${user.role ? ` (${user.role})` : ''}${isDriver ? ' - Driving' : ''}`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              {isDriver && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
              )}
              {/* Note: Presence doesn't store userId, so we can't match raised hands to presence users
                  This would require storing userId in presence data */}
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-1">
        {allUsers.map((user, index) => (
          <div key={user.isSelf ? 'self' : `other-${index}`} className="flex items-center gap-2">
            <Badge variant={user.role === 'interviewer' ? 'default' : 'secondary'}>
              {user.name}
            </Badge>
            {user.role && (
              <span className="text-xs text-muted-foreground">
                {user.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

