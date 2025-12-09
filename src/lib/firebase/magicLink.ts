import { verifyMagicLinkToken } from './auth'
import type { MagicLinkTokenClaims, MagicLinkValidationResult } from '@/modules/auth/types'

/**
 * Generate magic link token
 * 
 * Generates a simple token string for magic links.
 * Format: `roomId:${roomId}:role:candidate:exp:${timestamp}`
 * 
 * Note: This is a client-side placeholder. In production, this should be
 * generated server-side via Cloud Function for security.
 * 
 * @param roomId - Room ID
 * @param role - User role (typically 'candidate')
 * @param expiresInHours - Token expiration in hours (default: 24)
 * @returns Magic link token string
 */
export function generateMagicLinkToken(
  roomId: string,
  role: 'interviewer' | 'candidate' = 'candidate',
  expiresInHours: number = 24
): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 60 * 60
  return `roomId:${roomId}:role:${role}:exp:${exp}`
}

/**
 * Generate magic link URL
 * 
 * Creates the full URL for a magic link.
 * 
 * @param token - Magic link token
 * @param baseUrl - Base URL (defaults to current origin)
 * @returns Full magic link URL
 */
export function generateMagicLinkUrl(
  token: string,
  baseUrl?: string
): string {
  const origin = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '')
  return `${origin}/join/${token}`
}

/**
 * Validate magic link token
 * 
 * Validates a JWT token from a magic link by:
 * 1. Checking token format
 * 2. Decoding and verifying claims
 * 3. Checking expiration
 * 4. Extracting roomId and role
 * 
 * @param token - JWT token from magic link
 * @returns Validation result with claims if valid
 */
export async function validateMagicLinkToken(
  token: string
): Promise<MagicLinkValidationResult> {
  try {
    const result = await verifyMagicLinkToken(token)

    if (!result.valid || !result.claims) {
      return {
        valid: false,
        error: result.error ?? 'Invalid token',
      }
    }

    // Validate required claims
    const { roomId, role, exp } = result.claims as Partial<MagicLinkTokenClaims>

    if (!roomId || typeof roomId !== 'string') {
      return {
        valid: false,
        error: 'Token missing roomId claim',
      }
    }

    if (!role || (role !== 'interviewer' && role !== 'candidate')) {
      return {
        valid: false,
        error: 'Token missing or invalid role claim',
      }
    }

    if (!exp || typeof exp !== 'number') {
      return {
        valid: false,
        error: 'Token missing expiration claim',
      }
    }

    // Check expiration
    if (exp < Date.now() / 1000) {
      return {
        valid: false,
        error: 'Token has expired',
      }
    }

    const claims: MagicLinkTokenClaims = {
      roomId: roomId as string,
      role: role as 'interviewer' | 'candidate',
      exp: exp as number,
      iat: (result.claims.iat as number) ?? Math.floor(Date.now() / 1000),
    }

    return {
      valid: true,
      claims,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    }
  }
}

/**
 * Extract token claims
 * 
 * Extracts claims from a validated magic link token.
 * This should only be called after validateMagicLinkToken returns valid: true.
 * 
 * @param token - JWT token from magic link
 * @returns Extracted claims
 * @throws {Error} If token is invalid or claims are missing
 */
export async function extractTokenClaims(
  token: string
): Promise<MagicLinkTokenClaims> {
  const validation = await validateMagicLinkToken(token)

  if (!validation.valid || !validation.claims) {
    throw new Error(validation.error ?? 'Invalid token')
  }

  return validation.claims
}

