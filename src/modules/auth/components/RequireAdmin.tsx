import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'
import { Button } from '@/components/ui/button'

/**
 * RequireAdmin component
 * 
 * Protects routes that require admin access.
 * Shows loading state while checking admin status, redirects if not admin.
 * 
 * @param children - Child components to render if user is admin
 * @param fallback - Optional fallback component to show while loading
 */
interface RequireAdminProps {
  children: ReactNode
  fallback?: ReactNode
}

export function RequireAdmin({ children, fallback }: RequireAdminProps) {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()

  const loading = authLoading || adminLoading

  // Show loading state
  if (loading) {
    return (
      fallback ?? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Checking access...</p>
          </div>
        </div>
      )
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">
              You don't have admin access to view this page.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render children if user is admin
  return <>{children}</>
}

