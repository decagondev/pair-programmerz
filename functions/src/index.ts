/**
 * Firebase Cloud Functions
 * 
 * This file contains Cloud Functions for PairCode.
 * 
 * To deploy:
 * 1. Install dependencies: cd functions && npm install
 * 2. Deploy: firebase deploy --only functions
 * 
 * @module functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'

/**
 * Generate magic link token
 * 
 * This function generates a secure JWT token for room access.
 * The token includes:
 * - roomId: The room the user is joining
 * - role: User role (interviewer or candidate)
 * - exp: Expiration timestamp
 * 
 * @param request - HTTP request containing roomId and role
 * @returns JSON response with token
 * 
 * @example
 * POST /generateMagicLink
 * Body: { roomId: "room123", role: "candidate" }
 * Response: { token: "eyJhbGc..." }
 */
export const generateMagicLink = onRequest(
  {
    cors: true,
  },
  async (request, response) => {
    try {
      const { roomId, role } = request.body

      if (!roomId || !role) {
        response.status(400).json({
          error: 'Missing required fields: roomId and role are required',
        })
        return
      }

      if (role !== 'interviewer' && role !== 'candidate') {
        response.status(400).json({
          error: 'Invalid role. Must be "interviewer" or "candidate"',
        })
        return
      }

      // TODO: Implement JWT token generation
      // For now, return a placeholder response
      logger.warn('generateMagicLink: JWT token generation not yet implemented')
      
      response.status(501).json({
        error: 'Magic link generation not yet implemented',
        message: 'This will be implemented in the deployment phase',
      })
    } catch (error) {
      logger.error('Error generating magic link', error)
      response.status(500).json({
        error: 'Internal server error',
      })
    }
  }
)

