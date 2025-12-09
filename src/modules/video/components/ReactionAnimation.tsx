import { useEffect, useState } from 'react'
import { useReactions } from '../hooks/useReactions'
import { cn } from '@/lib/utils'
import type { Reaction } from '../types'

/**
 * Props for ReactionAnimation component
 */
interface ReactionAnimationProps {
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
 * Reaction animation component
 * 
 * Displays animated emoji reactions that fly up from their trigger position.
 * Reactions automatically disappear after animation completes.
 * 
 * @param props - Component props
 */
export function ReactionAnimation({ roomId, className }: ReactionAnimationProps) {
  const { reactions } = useReactions(roomId)
  const [displayedReactions, setDisplayedReactions] = useState<Array<Reaction & { x: number; y: number }>>([])

  // Add new reactions to display
  useEffect(() => {
    if (reactions.length === 0) {
      setDisplayedReactions([])
      return
    }

    // For simplicity, we'll display reactions at random positions
    // In a real implementation, you'd track the click position
    const newReactions = reactions.map((reaction) => ({
      ...reaction,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight - 100,
    }))

    setDisplayedReactions(newReactions)

    // Remove reactions after animation (3 seconds)
    const timeout = setTimeout(() => {
      setDisplayedReactions([])
    }, 3000)

    return () => clearTimeout(timeout)
  }, [reactions])

  if (displayedReactions.length === 0) {
    return null
  }

  return (
    <div className={cn('pointer-events-none fixed inset-0 z-50', className)}>
      {displayedReactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute animate-reaction-float"
          style={{
            left: `${reaction.x}px`,
            top: `${reaction.y}px`,
            animation: 'reactionFloat 3s ease-out forwards',
          }}
        >
          <span className="text-4xl">{reaction.emoji}</span>
        </div>
      ))}
    </div>
  )
}

