import { memo } from 'react'
import { useReactions } from '../hooks/useReactions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Props for ReactionButton component
 */
interface ReactionButtonProps {
  /**
   * Room ID
   */
  roomId: string | null
  /**
   * Emoji to display
   */
  emoji: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Aria label
   */
  'aria-label'?: string
}

/**
 * Reaction button component
 * 
 * Button that triggers a reaction when clicked.
 * 
 * @param props - Component props
 */
export const ReactionButton = memo(function ReactionButton({
  roomId,
  emoji,
  className,
  'aria-label': ariaLabel,
}: ReactionButtonProps) {
  const { triggerReaction } = useReactions(roomId)

  const handleClick = () => {
    triggerReaction(emoji)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn('text-2xl', className)}
      aria-label={ariaLabel || `React with ${emoji}`}
      title={ariaLabel || `React with ${emoji}`}
    >
      {emoji}
    </Button>
  )
})

/**
 * Props for ReactionBar component
 */
interface ReactionBarProps {
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
 * Reaction bar component
 * 
 * Container with quick reaction buttons.
 * 
 * @param props - Component props
 */
export function ReactionBar({ roomId, className }: ReactionBarProps) {
  const reactions = ['👍', '❤️', '😂', '🎉', '👏', '🔥']

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {reactions.map((emoji) => (
        <ReactionButton
          key={emoji}
          roomId={roomId}
          emoji={emoji}
          aria-label={`React with ${emoji}`}
        />
      ))}
    </div>
  )
}

