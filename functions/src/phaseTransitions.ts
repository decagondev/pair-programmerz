/**
 * Phase transitions Cloud Function
 * 
 * Auto-advances interview phases when phase duration expires.
 * Runs on a schedule to check all active rooms.
 * 
 * @module functions/phaseTransitions
 */

import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp()
}

const db = getFirestore()

/**
 * Phase durations in milliseconds
 */
const PHASE_DURATIONS_MS: Record<string, number> = {
  tone: 5 * 60 * 1000, // 5 minutes
  coding: 45 * 60 * 1000, // 45 minutes
  reflection: 10 * 60 * 1000, // 10 minutes
}

/**
 * Next phase mapping
 */
const NEXT_PHASE: Record<string, string | null> = {
  waiting: 'tone',
  tone: 'coding',
  coding: 'reflection',
  reflection: 'ended',
  ended: null,
}

/**
 * Check and advance phases for all active rooms
 * 
 * This function runs on a schedule (every minute) to check if any rooms
 * need their phase advanced based on elapsed time.
 */
export const checkPhaseTransitions = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'UTC',
  },
  async () => {
    try {
      logger.info('Checking phase transitions for active rooms')

      const now = Timestamp.now()
      const roomsRef = db.collection('rooms')

      // Query rooms in active phases (tone, coding, reflection)
      const activePhases = ['tone', 'coding', 'reflection']
      const roomsSnapshot = await roomsRef
        .where('phase', 'in', activePhases)
        .where('status', '==', 'active')
        .get()

      if (roomsSnapshot.empty) {
        logger.info('No active rooms found')
        return
      }

      let transitionsCount = 0

      for (const roomDoc of roomsSnapshot.docs) {
        const roomData = roomDoc.data()
        const phase = roomData.phase as string
        const phaseStartedAt = roomData.phaseStartedAt as Timestamp | undefined

        if (!phaseStartedAt) {
          logger.warn(`Room ${roomDoc.id} has no phaseStartedAt timestamp, skipping`)
          continue
        }

        const phaseDuration = PHASE_DURATIONS_MS[phase]
        if (!phaseDuration) {
          logger.warn(`Unknown phase duration for phase: ${phase}, skipping`)
          continue
        }

        // Calculate elapsed time
        const elapsedMs = now.toMillis() - phaseStartedAt.toMillis()

        // Check if phase duration has expired
        if (elapsedMs >= phaseDuration) {
          const nextPhase = NEXT_PHASE[phase]

          if (!nextPhase) {
            logger.warn(`No next phase for ${phase}, skipping`)
            continue
          }

          // Advance to next phase
          const updateData: Record<string, unknown> = {
            phase: nextPhase,
            phaseStartedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }

          // Update status if ending
          if (nextPhase === 'ended') {
            updateData.status = 'finished'
          }

          await roomDoc.ref.update(updateData)
          transitionsCount++

          logger.info(
            `Room ${roomDoc.id} phase transition: ${phase} -> ${nextPhase}`
          )
        }
      }

      logger.info(`Phase transitions completed: ${transitionsCount} rooms advanced`)
    } catch (error) {
      logger.error('Error checking phase transitions', error)
      throw error
    }
  }
)

