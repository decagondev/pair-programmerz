import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom'
import { JoinPage, AuthProvider, RequireAuth, RequireRole, RequireAdmin, useAuth } from '@/modules/auth'
import { ThemeProvider, ThemeToggle } from '@/modules/theme'
import { Button } from '@/components/ui/button'

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
  const { user, signInWithGoogle, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Redirect to dashboard after sign in
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to sign in:', error)
      // Error is already handled by useAuth hook
    }
  }

  // If user is already signed in, redirect to dashboard
  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="space-y-8 text-center max-w-md w-full">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">PairCode</h1>
            <p className="text-lg text-muted-foreground">
              Real-time pair programming interviews
            </p>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Collaborate in real-time with candidates using our integrated code editor and video conferencing.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={handleSignIn}
            disabled={loading}
            size="lg"
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-md"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
          
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error.message || 'Failed to sign in. Please try again.'}
            </div>
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
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

export default App
