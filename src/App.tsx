import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { JoinPage, AuthProvider, RequireAuth, RequireRole } from '@/modules/auth'
import { DashboardLayout } from '@/modules/dashboard'
import { EditorLayout } from '@/modules/editor'

/**
 * Landing page component
 * 
 * Simple placeholder for the home page.
 * Will be replaced with proper landing page in future epic.
 */
function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">PairCode</h1>
        <p className="text-muted-foreground">Real-time pair programming interviews</p>
      </div>
    </div>
  )
}

/**
 * Room page component
 * 
 * Main interview room interface with collaborative editor.
 * Uses EditorLayout which handles all editor functionality.
 */
function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()

  if (!roomId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Room not found</h1>
          <p className="text-muted-foreground">Invalid room ID</p>
        </div>
      </div>
    )
  }

  return <EditorLayout roomId={roomId} />
}

/**
 * Main App component
 * 
 * Sets up routing for the application with authentication and role-based protection.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/join/:token" element={<JoinPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <RequireRole requiredRole="interviewer">
                  <DashboardLayout />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <RequireAuth>
                <RoomPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
