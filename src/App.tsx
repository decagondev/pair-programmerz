import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom'
import { JoinPage, AuthProvider, RequireAuth, RequireRole, RequireAdmin, useAuth } from '@/modules/auth'

// Lazy load major routes for code splitting
const DashboardLayout = lazy(() => import('@/modules/dashboard').then(m => ({ default: m.DashboardLayout })))
const EditorLayout = lazy(() => import('@/modules/editor').then(m => ({ default: m.EditorLayout })))
const SessionSummary = lazy(() => import('@/modules/feedback').then(m => ({ default: m.SessionSummary })))
const AdminTasksPage = lazy(() => import('@/modules/task').then(m => ({ default: m.AdminTasksPage })))

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Landing page component
 * 
 * Simple placeholder for the home page.
 * Will be replaced with proper landing page in future epic.
 */
function HomePage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Redirect to dashboard after sign in
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="space-y-6 text-center max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">PairCode</h1>
          <p className="text-muted-foreground">Real-time pair programming interviews</p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          {user ? (
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Go to Dashboard
            </a>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          )}
        </div>
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

  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditorLayout roomId={roomId} />
    </Suspense>
  )
}

/**
 * Summary page component
 * 
 * Displays session summary with reflection responses and private notes.
 * Accessible when phase is 'ended'.
 */
function SummaryPage() {
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

  return (
    <Suspense fallback={<LoadingFallback />}>
      <SessionSummary roomId={roomId} />
    </Suspense>
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
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/join/:token" element={<JoinPage />} />

          {/* Protected routes */}
          {/* Redirect /wizard to /dashboard (wizard is now a dialog, not a separate route) */}
          <Route
            path="/wizard"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/wizard/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <RequireRole requiredRole="interviewer">
                  <Suspense fallback={<LoadingFallback />}>
                    <DashboardLayout />
                  </Suspense>
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingFallback />}>
                  <RoomPage />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/room/:roomId/summary"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingFallback />}>
                  <SummaryPage />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminTasksPage />
                  </Suspense>
                </RequireAdmin>
              </RequireAuth>
            }
          />
          {/* Catch-all route for unknown paths */}
          <Route
            path="*"
            element={
              <div className="flex min-h-screen flex-col items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Page not found</h1>
                  <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
