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
 * IMPORTANT: Export order matters for initialization.
 * env.ts must be evaluated first, then other configs that depend on it.
 * 
 * @module config
 */

// Environment validation - MUST be exported first
// This ensures env is initialized before any other config that depends on it
export { env, type Env } from './env'

// Firebase - depends on env
export { firebaseApp, auth, db } from './firebase'

// Liveblocks - depends on env
export { liveblocksClient } from './liveblocks'

// Jitsi Meet - depends on env
export { jitsiDomain, jitsiJaaSConfig, defaultJitsiConfig, defaultJitsiInterfaceConfig } from './jitsi'

