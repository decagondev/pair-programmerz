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
  // Jitsi as a Service (JaaS) configuration (optional)
  VITE_JITSI_APP_ID: z.string().optional(),
  VITE_JITSI_JWT: z.string().optional(),
  // JaaS tenant name (required if using JaaS)
  // Get this from your JaaS dashboard - it's part of your App ID
  VITE_JITSI_TENANT: z.string().optional(),
})

/**
 * Validated environment variables
 * 
 * This object contains all validated environment variables.
 * Access environment variables through this object, not directly from import.meta.env.
 * 
 * @throws {z.ZodError} If any required environment variable is missing or invalid
 */
const parseEnv = () => {
  try {
    return envSchema.parse({
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
      VITE_LIVEBLOCKS_PUBLIC_KEY: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
      VITE_JITSI_DOMAIN: import.meta.env.VITE_JITSI_DOMAIN,
      VITE_JITSI_APP_ID: import.meta.env.VITE_JITSI_APP_ID,
      VITE_JITSI_JWT: import.meta.env.VITE_JITSI_JWT,
      VITE_JITSI_TENANT: import.meta.env.VITE_JITSI_TENANT,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter((e: z.ZodIssue) => e.code === 'too_small' || e.code === 'invalid_type')
        .map((e: z.ZodIssue) => e.path.join('.'))
        .join(', ')
      
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n\n` +
        `Please create a .env file in the project root with the required variables.\n` +
        `See env.example for a template.`
      )
    }
    throw error
  }
}

export const env = parseEnv()

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>

