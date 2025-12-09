import { useDriver } from '../hooks/useDriver'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Props for DriverControls component
 */
interface DriverControlsProps {
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
 * Driver controls component
 * 
 * Provides buttons to request, release, or take control of the editor.
 * Interviewers can force take control.
 * 
 * @param props - Component props
 */
export function DriverControls({ roomId, className }: DriverControlsProps) {
  const { isDriver, isInterviewer, requestControl, releaseControl, takeControl } =
    useDriver(roomId)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!isDriver && (
        <>
          <Button onClick={requestControl} size="sm" variant="default">
            Request Control
          </Button>
          {isInterviewer && (
            <Button onClick={takeControl} size="sm" variant="outline">
              Take Control
            </Button>
          )}
        </>
      )}
      {isDriver && (
        <Button onClick={releaseControl} size="sm" variant="secondary">
          Release Control
        </Button>
      )}
    </div>
  )
}

