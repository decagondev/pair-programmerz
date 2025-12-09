import { useTimer } from '../hooks/useTimer'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

/**
 * Props for TimerDisplay component
 */
interface TimerDisplayProps {
  /**
   * Room ID
   */
  roomId: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Timer display component
 * 
 * Shows a big visible countdown timer with color-coded states:
 * - Green: Normal (> 5 minutes)
 * - Yellow: Warning (< 5 minutes)
 * - Red: Critical (< 2 minutes)
 * 
 * Only displays during active phases (tone, coding, reflection).
 * 
 * @param props - Component props
 */
export function TimerDisplay({ roomId, className }: TimerDisplayProps) {
  const { timerState, formattedTime, isLoading } = useTimer(roomId)

  // Don't show timer if loading or no active timer
  if (isLoading || !timerState) {
    return null
  }

  // Determine color based on timer state
  const colorClass = timerState.isExpired
    ? 'text-destructive'
    : timerState.isCritical
    ? 'text-destructive'
    : timerState.isWarning
    ? 'text-yellow-500'
    : 'text-green-500'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-background px-4 py-2',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Time remaining: ${formattedTime}`}
    >
      <Clock className={cn('h-5 w-5', colorClass)} aria-hidden="true" />
      <span
        className={cn(
          'text-2xl font-mono font-bold tabular-nums',
          colorClass
        )}
      >
        {formattedTime}
      </span>
    </div>
  )
}

