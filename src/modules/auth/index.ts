/**
 * Authentication module
 * 
 * This module handles user authentication, authorization, and role management.
 * 
 * @module auth
 */

// Hooks
export { useAuth } from './hooks/useAuth'
export { useMagicLink } from './hooks/useMagicLink'
export { useRole } from './hooks/useRole'
export { useAdmin } from './hooks/useAdmin'

// Components
export { JoinPage } from './components/JoinPage'
export { RequireAuth } from './components/RequireAuth'
export { RequireRole } from './components/RequireRole'
export { RequireAdmin } from './components/RequireAdmin'
export { AuthProvider } from './components/AuthProvider'

// Types
export type { AuthUser, AuthState, MagicLinkTokenClaims, MagicLinkValidationResult } from './types'

