import { useRole } from '@/modules/auth'
import { usePhase } from '../hooks/usePhase'
import { usePhaseTransition } from '../hooks/usePhaseTransition'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight, Square } from 'lucide-react'

/**
 * Props for PhaseControls component
 */
interface PhaseControlsProps {
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
 * Phase controls component
 * 
 * Provides buttons for interviewer to manually advance phases or end interview early.
 * Only visible to interviewers.
 * 
 * @param props - Component props
 */
export function PhaseControls({ roomId, className }: PhaseControlsProps) {
  const { role } = useRole(roomId)
  const { phase, nextPhase, canAdvancePhase, canEndEarly } = usePhase(roomId)
  const transition = usePhaseTransition(roomId)

  // Only show controls to interviewers
  if (role !== 'interviewer') {
    return null
  }

  const handleAdvancePhase = () => {
    if (!nextPhase) return
    transition.mutate({ phase: nextPhase })
  }

  const handleEndEarly = () => {
    transition.mutate({ phase: 'ended' })
  }

  const getPhaseLabel = (phase: string | null) => {
    switch (phase) {
      case 'waiting':
        return 'Waiting'
      case 'tone':
        return 'Set Tone'
      case 'coding':
        return 'Coding'
      case 'reflection':
        return 'Reflection'
      case 'ended':
        return 'Ended'
      default:
        return phase ?? 'Unknown'
    }
  }

  const getNextPhaseLabel = (nextPhase: string | null) => {
    switch (nextPhase) {
      case 'tone':
        return 'Start Set Tone'
      case 'coding':
        return 'Start Coding'
      case 'reflection':
        return 'Start Reflection'
      case 'ended':
        return 'End Interview'
      default:
        return 'Next Phase'
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {phase && phase !== 'ended' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Phase: {getPhaseLabel(phase)}</span>
        </div>
      )}
      {canAdvancePhase && nextPhase && (
        <Button
          onClick={handleAdvancePhase}
          size="sm"
          variant="default"
          disabled={transition.isPending}
        >
          <ChevronRight className="mr-1 h-4 w-4" />
          {getNextPhaseLabel(nextPhase)}
        </Button>
      )}
      {canEndEarly && phase !== 'ended' && (
        <Button
          onClick={handleEndEarly}
          size="sm"
          variant="destructive"
          disabled={transition.isPending}
        >
          <Square className="mr-1 h-4 w-4" />
          End Interview
        </Button>
      )}
    </div>
  )
}

