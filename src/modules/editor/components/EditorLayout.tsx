import { LiveblocksRoomProvider, CodeEditor, DriverIndicator, DriverControls, PresenceIndicator, FileTree } from '../index'
import { useDriver } from '../hooks/useDriver'
import { useFileTree } from '../hooks/useFileTree'
import { VideoGrid, VideoControls, ReactionBar, ReactionAnimation, RaiseHandButton, RaiseHandNotification } from '@/modules/video'
import { useAuth } from '@/modules/auth'
import { useUserStore } from '@/modules/store'
import { cn } from '@/lib/utils'

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
      <header className="flex items-center justify-between border-b bg-background p-4">
        <h1 className="text-xl font-semibold">Interview Room</h1>
        <div className="flex items-center gap-4">
          <PresenceIndicator roomId={roomId} />
          <ReactionBar roomId={roomId} />
          <RaiseHandButton roomId={roomId} />
          <VideoControls roomId={roomId} />
          <DriverControls roomId={roomId} />
        </div>
      </header>
      <DriverIndicator roomId={roomId} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-muted/50">
          <div className="p-2">
            <h2 className="mb-2 text-sm font-semibold">Files</h2>
            <FileTree roomId={roomId} />
          </div>
        </aside>
        <main className="flex-1 overflow-hidden">
          <CodeEditor
            fileContent={fileContent}
            activeFile={activeFile}
            isDriver={isDriver}
            language={language}
            className="h-full"
          />
        </main>
        <aside className="w-80 border-l bg-muted/50">
          <div className="h-full p-2">
            <h2 className="mb-2 text-sm font-semibold">Video</h2>
            <VideoGrid roomId={roomId} className="h-full" />
          </div>
        </aside>
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

