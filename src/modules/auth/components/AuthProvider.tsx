import { type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'

/**
 * AuthProvider component
 * 
 * Wraps the app and initializes authentication state.
 * The useAuth hook is called here to set up auth state listeners.
 * 
 * @param children - Child components
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Check if error is a Firebase configuration error
 */
function isConfigurationError(error: Error | null): boolean {
  if (!error) return false
  const errorMessage = error.message || ''
  const errorCode = (error as { code?: string }).code || ''
  
  return (
    errorMessage.includes('CONFIGURATION_NOT_FOUND') ||
    errorMessage.includes('Firebase Authentication is not configured') ||
    errorMessage.includes('configuration-not-found') ||
    errorCode.includes('CONFIGURATION_NOT_FOUND') ||
    errorCode.includes('configuration-not-found') ||
    errorMessage.includes('400') && errorMessage.includes('Bad Request')
  )
}

/**
 * Error display component for Firebase configuration errors
 */
function FirebaseConfigError({ error }: { error: Error }) {
  const errorMessage = error.message

  if (isConfigurationError(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-4 rounded-lg border border-destructive/50 bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-destructive">Firebase Configuration Required</h1>
            <p className="text-sm text-muted-foreground">
              Firebase Authentication is not properly configured. Please complete the setup steps below.
            </p>
          </div>

          <div className="space-y-3 rounded-md bg-muted p-4">
            <h2 className="font-semibold">Quick Setup Steps:</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Firebase Console</a></li>
              <li>Enable <strong>Anonymous Authentication</strong> in Authentication → Sign-in method</li>
              <li>Create a <strong>Firestore Database</strong> (start in test mode)</li>
              <li>Copy your Firebase config values to <code className="rounded bg-background px-1 py-0.5 text-xs">.env</code> file</li>
              <li>See <code className="rounded bg-background px-1 py-0.5 text-xs">docs/FIREBASE_SETUP.md</code> for detailed instructions</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
            >
              Open Firebase Console
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Generic error display
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-destructive/50 bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-destructive">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Retry
        </Button>
      </div>
    </div>
  )
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state by calling useAuth
  // This sets up the onAuthStateChanged listener
  const { error } = useAuth()

  // Show error UI if there's a configuration error
  if (error && isConfigurationError(error)) {
    return <FirebaseConfigError error={error} />
  }

  // Simply render children - auth state is managed globally via useAuth hook
  return <>{children}</>
}

