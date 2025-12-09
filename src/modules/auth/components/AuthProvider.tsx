import { type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

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

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state by calling useAuth
  // This sets up the onAuthStateChanged listener
  useAuth()

  // Simply render children - auth state is managed globally via useAuth hook
  return <>{children}</>
}

