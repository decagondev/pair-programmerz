import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * RequireAuth component
 * 
 * Protects routes that require authentication.
 * Shows loading state while checking auth, redirects to home if not authenticated.
 * 
 * @param children - Child components to render if authenticated
 * @param fallback - Optional fallback component to show while loading
 */
interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      fallback ?? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Render children if authenticated
  return <>{children}</>
}

