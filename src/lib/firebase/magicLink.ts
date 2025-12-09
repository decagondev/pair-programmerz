import { verifyMagicLinkToken } from './auth'
import type { MagicLinkTokenClaims, MagicLinkValidationResult } from '@/modules/auth/types'

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

