import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoomList } from './RoomList'
import { CreateRoomDialog } from './CreateRoomDialog'

/**
 * Dashboard layout component
 * 
 * Main dashboard page for interviewers with room list and create room button.
 */
export function DashboardLayout() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interview Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your interview rooms
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        </div>

        {/* Room list */}
        <RoomList />

        {/* Create room dialog */}
        <CreateRoomDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </div>
  )
}

