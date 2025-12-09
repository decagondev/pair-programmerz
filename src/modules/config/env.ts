import { z } from 'zod'

/**
 * Environment variable schema
 * 
 * Validates all required environment variables at app startup.
 * Throws an error if any required variables are missing or invalid.
 */
const envSchema = z.object({
  // Firebase configuration
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),

  // Liveblocks configuration
  VITE_LIVEBLOCKS_PUBLIC_KEY: z.string().min(1, 'Liveblocks public key is required'),

  // Jitsi configuration (optional - defaults to meet.jit.si)
  VITE_JITSI_DOMAIN: z.string().optional(),
})

/**
 * Validated environment variables
 * 
 * This object contains all validated environment variables.
 * Access environment variables through this object, not directly from import.meta.env.
 * 
 * @throws {z.ZodError} If any required environment variable is missing or invalid
 */
export const env = envSchema.parse({
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_LIVEBLOCKS_PUBLIC_KEY: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
  VITE_JITSI_DOMAIN: import.meta.env.VITE_JITSI_DOMAIN,
})

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>

