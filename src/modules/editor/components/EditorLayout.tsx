import { useState } from 'react'
import { LiveblocksRoomProvider, CodeEditor, DriverIndicator, DriverControls, PresenceIndicator, FileTree } from '../index'
import { useDriver } from '../hooks/useDriver'
import { useFileTree } from '../hooks/useFileTree'
import { VideoGrid, VideoControls, ReactionBar, ReactionAnimation, RaiseHandButton, RaiseHandNotification } from '@/modules/video'
import { TimerDisplay, PhaseControls, usePhaseLock } from '@/modules/timer'
import { ReflectionForm, PrivateNotes } from '@/modules/feedback'
import { useAuth } from '@/modules/auth'
import { useRole } from '@/modules/auth'
import { useUserStore } from '@/modules/store'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/modules/theme'

/**
 * Props for EditorLayout component
 */
interface EditorLayoutProps {
  /**
   * Room ID (from Firestore)
   */
  roomId: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Editor layout component
 * 
 * Main layout component that combines file tree, code editor, driver controls, and presence.
 * Wraps everything with LiveblocksRoomProvider for real-time collaboration.
 * 
 * @param props - Component props
 */
function EditorLayoutContent({ roomId, className }: EditorLayoutProps) {
  const { isDriver } = useDriver(roomId)
  const { activeFile, getFileContent } = useFileTree(roomId)
  const { isEditorLocked } = usePhaseLock(roomId)
  const { role } = useRole(roomId)
  const isInterviewer = role === 'interviewer'
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const fileContent = activeFile ? getFileContent(activeFile) : ''

  // Determine language from file extension
  const language = activeFile?.endsWith('.tsx') || activeFile?.endsWith('.ts')
    ? 'typescript'
    : activeFile?.endsWith('.jsx') || activeFile?.endsWith('.js')
    ? 'javascript'
    : 'typescript'

  return (
    <div className={cn('flex h-screen flex-col', className)}>
      <ReactionAnimation roomId={roomId} />
      <RaiseHandNotification roomId={roomId} />
      <header className="flex flex-col gap-2 border-b bg-background p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            aria-label={isFileTreeOpen ? 'Close file tree' : 'Open file tree'}
          >
            {isFileTreeOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <h1 className="text-lg font-semibold md:text-xl">Interview Room</h1>
          <div className="hidden md:block">
            <TimerDisplay roomId={roomId} />
          </div>
          <div className="hidden md:block">
            <PhaseControls roomId={roomId} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="md:hidden">
            <TimerDisplay roomId={roomId} />
          </div>
          <div className="md:hidden">
            <PhaseControls roomId={roomId} />
          </div>
          <ThemeToggle />
          <PresenceIndicator roomId={roomId} />
          <ReactionBar roomId={roomId} />
          <RaiseHandButton roomId={roomId} />
          <VideoControls roomId={roomId} />
          <DriverControls roomId={roomId} />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsVideoOpen(!isVideoOpen)}
            aria-label={isVideoOpen ? 'Close video' : 'Open video'}
          >
            {isVideoOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <DriverIndicator roomId={roomId} />
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row" id="main-content">
        {/* File tree - drawer on mobile, sidebar on desktop */}
        <aside
          className={cn(
            'absolute left-0 top-0 z-40 h-full w-64 border-r bg-muted/50 transition-transform md:relative md:z-auto md:translate-x-0',
            isFileTreeOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
          aria-label="File tree navigation"
          aria-expanded={isFileTreeOpen}
        >
          <div className="flex h-full flex-col p-2">
            <div className="mb-2 flex items-center justify-between md:block">
              <h2 className="text-sm font-semibold">Files</h2>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsFileTreeOpen(false)}
                aria-label="Close file tree"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FileTree roomId={roomId} />
          </div>
        </aside>
        {/* Overlay for mobile drawer */}
        {isFileTreeOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsFileTreeOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Main editor area */}
        <main className="flex-1 overflow-hidden">
          {isEditorLocked ? (
            <ReflectionForm roomId={roomId} />
          ) : (
            <CodeEditor
              fileContent={fileContent}
              activeFile={activeFile}
              isDriver={isDriver}
              language={language}
              className="h-full"
              roomId={roomId}
            />
          )}
        </main>
        {/* Video sidebar - bottom on mobile, right on desktop */}
        <aside
          className={cn(
            'absolute bottom-0 right-0 z-40 flex h-80 w-full flex-col border-t bg-muted/50 transition-transform md:relative md:z-auto md:h-auto md:w-80 md:border-l md:border-t-0',
            isVideoOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
          )}
          aria-label="Video and notes panel"
          aria-expanded={isVideoOpen}
        >
          <div className="flex h-full flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Video</h2>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <VideoGrid roomId={roomId} className="h-full" />
            </div>
            {isInterviewer && (
              <div className="h-80 shrink-0 overflow-hidden md:h-80">
                <PrivateNotes roomId={roomId} />
              </div>
            )}
          </div>
        </aside>
        {/* Overlay for mobile video drawer */}
        {isVideoOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsVideoOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}

/**
 * Editor layout with Liveblocks provider
 * 
 * Wraps the editor layout with LiveblocksRoomProvider for real-time collaboration.
 * 
 * @param props - Component props
 */
export function EditorLayout({ roomId, className }: EditorLayoutProps) {
  const { user } = useAuth()
  const { user: userState } = useUserStore()

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      </div>
    )
  }

  const displayName = userState.displayName || user.displayName || 'Anonymous'
  const role = userState.role || null

  return (
    <LiveblocksRoomProvider roomId={roomId} displayName={displayName} role={role}>
      <EditorLayoutContent roomId={roomId} className={className} />
    </LiveblocksRoomProvider>
  )
}

