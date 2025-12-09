import DailyIframe from '@daily-co/daily-js'
import { env } from './env'

/**
 * Daily.co configuration
 * 
 * This module provides Daily.co configuration and utilities.
 * The DailyIframe is used to create video call instances.
 */

/**
 * Daily.co domain
 * 
 * Use this domain when creating Daily.co room instances.
 */
export const dailyDomain = env.VITE_DAILY_DOMAIN

/**
 * Daily.co API key
 * 
 * Use this API key for server-side Daily.co operations (Cloud Functions).
 * For client-side operations, use DailyIframe with domain.
 */
export const dailyApiKey = env.VITE_DAILY_API_KEY

/**
 * DailyIframe export
 * 
 * Export DailyIframe for creating video call instances.
 * 
 * @example
 * ```typescript
 * import { DailyIframe, dailyDomain } from '@/modules/config'
 * const daily = DailyIframe.createFrame()
 * daily.join({ url: `https://${dailyDomain}/room-name` })
 * ```
 */
export { DailyIframe }

