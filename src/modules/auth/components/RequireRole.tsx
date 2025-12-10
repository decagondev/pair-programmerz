import { type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRole } from '../hooks/useRole'
import type { UserRole } from '@/modules/store/types'
import { Button } from '@/components/ui/button'

/**
 * RequireRole component
 * 
 * Protects routes that require a specific role.
 * Shows loading state while checking role, redirects if role doesn't match.
 * 
 * @param children - Child components to render if role matches
 * @param requiredRole - Required role (interviewer or candidate)
 * @param roomId - Room ID (optional, will be extracted from route params if not provided)
 * @param fallback - Optional fallback component to show while loading
 */
interface RequireRoleProps {
  children: ReactNode
  requiredRole: UserRole
  roomId?: string | null
  fallback?: ReactNode
}

export function RequireRole({
  children,
  requiredRole,
  roomId: providedRoomId,
  fallback,
}: RequireRoleProps) {
  const { user, loading: authLoading } = useAuth()
  const params = useParams<{ roomId?: string }>()
  const roomId = providedRoomId ?? params.roomId ?? null
  const { role, loading: roleLoading } = useRole(roomId)

  const loading = authLoading || roleLoading

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

  // Show access denied if role doesn't match
  // Special case: For dashboard (no roomId), allow authenticated users even if they haven't created rooms yet
  // They'll become an "interviewer" when they create their first room
  if (role !== requiredRole) {
    // If this is for dashboard access (no roomId) and user is authenticated, allow access
    // This allows first-time users to access the dashboard and create their first room
    if (!roomId && requiredRole === 'interviewer' && user) {
      // Allow access - user can create rooms and become an interviewer
      return <>{children}</>
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">
              You don't have the required role to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required: <span className="font-medium">{requiredRole}</span>
              {role && (
                <>
                  {' '}
                  | Your role: <span className="font-medium">{role}</span>
                </>
              )}
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
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render children if role matches
  return <>{children}</>
}

