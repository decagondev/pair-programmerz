import { useState } from 'react'
import { useRooms } from '../hooks/useRooms'
import { RoomCard } from './RoomCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { RoomStatusFilter } from '../types'
import type { RoomDocumentWithId } from '@/modules/room/types'
import { Loader2 } from 'lucide-react'

/**
 * Room list component
 * 
 * Displays a list of rooms with filtering by status.
 */
export function RoomList() {
  const { data: rooms = [], isLoading, error } = useRooms()
  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>('all')

  const filteredRooms = rooms.filter((room: RoomDocumentWithId) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'active') return room.status === 'active'
    if (statusFilter === 'finished') return room.status === 'finished'
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-destructive">Failed to load rooms</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No rooms yet
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first interview room to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All
          <Badge variant="secondary" className="ml-2">
            {rooms.length}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('active')}
        >
          Active
          <Badge variant="secondary" className="ml-2">
            {rooms.filter((r) => r.status === 'active').length}
          </Badge>
        </Button>
        <Button
          variant={statusFilter === 'finished' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('finished')}
        >
          Finished
          <Badge variant="secondary" className="ml-2">
            {rooms.filter((r) => r.status === 'finished').length}
          </Badge>
        </Button>
      </div>

      {/* Room grid */}
      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            No rooms match the selected filter
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}

