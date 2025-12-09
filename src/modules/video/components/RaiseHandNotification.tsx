import { useEffect, useState } from 'react'
import { useRaiseHand } from '../hooks/useRaiseHand'
import { usePresence } from '@/modules/editor/hooks/usePresence'
import { useAuth } from '@/modules/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for RaiseHandNotification component
 */
interface RaiseHandNotificationProps {
  /**
   * Room ID
   */
  roomId: string | null
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Raise hand notification component
 * 
 * Displays notifications when participants raise their hands.
 * Shows participant name and allows dismissal.
 * 
 * @param props - Component props
 */
export function RaiseHandNotification({ roomId, className }: RaiseHandNotificationProps) {
  const { raisedHands } = useRaiseHand(roomId)
  const { self } = usePresence()
  const { user } = useAuth()
  const [dismissedHands, setDismissedHands] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<Array<{ userId: string; name: string }>>([])

  // Update notifications when raised hands change
  useEffect(() => {
    const activeRaisedHands = raisedHands.filter((uid) => !dismissedHands.has(uid))

    const newNotifications = activeRaisedHands.map((userId) => {
      // Check if it's the current user
      if (userId === user?.uid && self) {
        return {
          userId,
          name: self.name || 'You',
        }
      }

      // For other users, we'll show a generic message
      // In a real implementation, we'd need to store userId in presence
      return {
        userId,
        name: 'A participant',
      }
    })

    setNotifications(newNotifications)
  }, [raisedHands, dismissedHands, user?.uid, self])

  /**
   * Dismiss a notification
   */
  const dismissNotification = (userId: string) => {
    setDismissedHands((prev) => new Set([...prev, userId]))
  }

  // Play sound when new hand is raised (optional, subtle chime)
  useEffect(() => {
    if (notifications.length > 0) {
      // Create a subtle notification sound
      // Using Web Audio API for a simple chime
      try {
        const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return
        const audioContext = new AudioContextClass()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      } catch {
        // Ignore audio errors (browser may not support or require user interaction)
      }
    }
  }, [notifications.length])

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className={cn('fixed top-4 right-4 z-50 flex flex-col gap-2', className)}>
      {notifications.map((notification) => (
        <div
          key={notification.userId}
          className="flex items-center gap-2 rounded-lg border bg-background p-3 shadow-lg animate-in slide-in-from-right"
        >
          <Badge variant="default" className="flex items-center gap-1">
            <span>✋</span>
            <span>{notification.name} raised their hand</span>
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => dismissNotification(notification.userId)}
            className="h-6 w-6"
            aria-label="Dismiss notification"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}

