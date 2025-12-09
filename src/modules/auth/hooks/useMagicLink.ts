import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateMagicLinkToken, extractTokenClaims } from '@/lib/firebase/magicLink'

/**
 * Magic link hook
 * 
 * Handles magic link token validation and user sign-in flow.
 * 
 * @returns Magic link validation and sign-in methods
 */
export function useMagicLink() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const navigate = useNavigate()

  /**
   * Validate magic link token
   */
  const validateToken = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await validateMagicLinkToken(token)

      if (!result.valid) {
        throw new Error(result.error ?? 'Invalid token')
      }

      return result.claims
    } catch (err) {
      const validationError =
        err instanceof Error ? err : new Error('Token validation failed')
      setError(validationError)
      throw validationError
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Sign in with magic link token
   * 
   * Validates the token, extracts claims, signs in the user,
   * and redirects to the appropriate room.
   */
  const signInWithToken = useCallback(
    async (token: string) => {
      setLoading(true)
      setError(null)

      try {
        // Validate token and extract claims
        const claims = await extractTokenClaims(token)

        // Sign in with custom token
        // Note: In production, this would use a Cloud Function to exchange
        // the magic link token for a Firebase custom token
        // For now, we'll use the token directly if it's a custom token
        // Otherwise, we'll need to call a Cloud Function endpoint

        // TODO: Implement Cloud Function call to exchange magic link token
        // for Firebase custom token
        // For now, we'll assume the token is already a custom token
        // In production, this flow would be:
        // 1. Validate magic link token (done)
        // 2. Call Cloud Function: exchangeMagicLinkToken(token)
        // 3. Cloud Function returns Firebase custom token
        // 4. Sign in with custom token

        // Placeholder: For now, we'll just validate and redirect
        // The actual sign-in will happen when the Cloud Function is implemented
        console.warn('Magic link token exchange not yet implemented. Using placeholder flow.')

        // Redirect to room
        navigate(`/room/${claims.roomId}`, { replace: true })
      } catch (err) {
        const signInError =
          err instanceof Error ? err : new Error('Failed to sign in with token')
        setError(signInError)
        throw signInError
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  return {
    validateToken,
    signInWithToken,
    loading,
    error,
  }
}

