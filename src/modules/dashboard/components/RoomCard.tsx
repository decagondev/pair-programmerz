import { useNavigate } from 'react-router-dom'
import { Calendar, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RoomDocumentWithId } from '@/modules/room/types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Room card component
 * 
 * Displays a single room with status, phase, and metadata.
 * Clicking the card navigates to the room.
 */
interface RoomCardProps {
  room: RoomDocumentWithId
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room/${room.id}`)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'finished':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPhaseLabel = (phase: string) => {
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
        return phase
    }
  }

  const updatedAt = room.updatedAt?.toDate?.() ?? new Date()
  const timeAgo = formatDistanceToNow(updatedAt, { addSuffix: true })

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        'hover:border-primary/50'
      )}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              Room {room.id.slice(0, 8)}
            </CardTitle>
            <CardDescription>
              {room.taskId ? `Task: ${room.taskId}` : 'No task assigned'}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(room.status)}>
            {room.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{getPhaseLabel(room.phase)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {timeAgo}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            Open Room
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

