import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useMagicLink } from '../hooks/useMagicLink'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/modules/theme'

/**
 * Join page component
 * 
 * Handles magic link token validation and user sign-in.
 * Users arrive here via a magic link containing a token.
 */
export function JoinPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { signInWithToken, loading, error } = useMagicLink()
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true })
      return
    }

    // Automatically attempt to sign in when component mounts
    const attemptSignIn = async () => {
      try {
        await signInWithToken(token)
      } catch (err) {
        // Error is handled by useMagicLink hook
        console.error('Failed to sign in with token:', err)
      }
    }

    attemptSignIn()
  }, [token, signInWithToken, navigate])

  const handleRetry = async () => {
    if (!token) return

    setRetryCount((prev) => prev + 1)
    try {
      await signInWithToken(token)
    } catch (err) {
      console.error('Retry failed:', err)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Joining Interview Room</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we validate your access...
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Validating token...</p>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-4">
            <div
              className={cn(
                'rounded-md border p-4',
                'border-destructive/50 bg-destructive/10',
                'dark:border-destructive dark:bg-destructive/20'
              )}
            >
              <h3 className="mb-2 font-semibold text-destructive">
                Failed to Join Room
              </h3>
              <p className="text-sm text-destructive/90">{error.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleRetry} disabled={loading} className="w-full">
                {retryCount > 0 ? 'Retry Again' : 'Retry'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/', { replace: true })}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  )
}

