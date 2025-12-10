import { useState } from 'react'
import { Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoomList } from './RoomList'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useAuth } from '@/modules/auth'
import { useNavigate } from 'react-router-dom'

/**
 * Dashboard layout component
 * 
 * Main dashboard page for interviewers with room list and create room button.
 */
export function DashboardLayout() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between md:justify-start md:flex-1">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Interview Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Manage your interview rooms
              </p>
            </div>
            
            {/* User menu */}
            {user && (
              <div className="flex items-center gap-3 md:ml-auto md:mr-4">
                <div className="hidden md:flex flex-col items-end text-sm">
                  <span className="font-medium">{user.displayName || 'User'}</span>
                  <span className="text-muted-foreground text-xs">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                    {getUserInitials()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Sign out</span>
                  </Button>
                </div>
              </div>
            )}
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

