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
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Interview Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your interview rooms
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="min-h-[44px] w-full md:w-auto"
            size="lg"
          >
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

