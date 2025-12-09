/**
 * Configuration module
 * 
 * This module provides centralized configuration for all external services:
 * - Firebase (Auth, Firestore)
 * - Liveblocks (real-time collaboration)
 * - Jitsi Meet (video/voice)
 * 
 * All configuration is validated at app startup via environment variables.
 * 
 * @module config
 */

// Environment validation
export { env, type Env } from './env'

// Firebase
export { firebaseApp, auth, db } from './firebase'

// Liveblocks
export { liveblocksClient } from './liveblocks'

// Jitsi Meet
export { jitsiDomain, defaultJitsiConfig, defaultJitsiInterfaceConfig } from './jitsi'

