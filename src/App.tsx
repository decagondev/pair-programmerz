import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { JoinPage, AuthProvider, RequireAuth, RequireRole } from '@/modules/auth'

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
 * Dashboard page component
 * 
 * Placeholder for interviewer dashboard.
 * Will be implemented in Epic 2.
 */
function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Interviewer dashboard coming soon</p>
      </div>
    </div>
  )
}

/**
 * Room page component
 * 
 * Placeholder for interview room.
 * Will be implemented in Epic 3.
 */
function RoomPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Interview Room</h1>
        <p className="text-muted-foreground">Room interface coming soon</p>
      </div>
    </div>
  )
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
                  <DashboardPage />
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
