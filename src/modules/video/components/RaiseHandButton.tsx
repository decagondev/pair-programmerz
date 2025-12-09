import { Hand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRaiseHand } from '../hooks/useRaiseHand'
import { cn } from '@/lib/utils'

/**
 * Props for RaiseHandButton component
 */
interface RaiseHandButtonProps {
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
 * Raise hand button component
 * 
 * Toggle button for raising/lowering hand.
 * Shows visual indicator when hand is raised.
 * 
 * @param props - Component props
 */
export function RaiseHandButton({ roomId, className }: RaiseHandButtonProps) {
  const { isRaised, toggleRaiseHand } = useRaiseHand(roomId)

  return (
    <Button
      type="button"
      variant={isRaised ? 'default' : 'outline'}
      size="icon"
      onClick={toggleRaiseHand}
      className={cn(isRaised && 'bg-primary', className)}
      aria-label={isRaised ? 'Lower hand' : 'Raise hand'}
      title={isRaised ? 'Lower hand' : 'Raise hand'}
    >
      <Hand className={cn('h-4 w-4', isRaised && 'animate-pulse')} />
    </Button>
  )
}

