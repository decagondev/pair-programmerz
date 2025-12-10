import { env } from './env'

/**
 * Jitsi Meet configuration
 * 
 * This module provides Jitsi Meet configuration and utilities.
 * Uses the JitsiMeeting component from @jitsi/react-sdk.
 */

/**
 * Jitsi Meet domain
 * 
 * Use this domain when creating Jitsi Meet room instances.
 * Defaults to 'meet.jit.si' if not configured.
 * For JaaS (Jitsi as a Service), use '8x8.vc'
 */
export const jitsiDomain = env.VITE_JITSI_DOMAIN || 'meet.jit.si'

/**
 * Jitsi as a Service (JaaS) configuration
 * 
 * JaaS provides a managed Jitsi instance with better reliability.
 * Get your App ID and Tenant from: https://jaas.8x8.vc/
 * 
 * Free Developer Plan: Up to 25 Monthly Active Users
 * 
 * Note: JaaS requires:
 * 1. A valid JWT token (generated server-side, room-specific)
 * 2. A tenant name (part of your App ID, e.g., "vpaas-magic-cookie-xxxxx")
 * 3. Room name format: {tenant}/{roomName}
 * 
 * JWT tokens must include the tenant in the payload and match the URL tenant.
 * Without JWT, rooms will be routed to lobby (members-only).
 * 
 * If App ID is set but JWT/Tenant is missing, we'll fall back to public Jitsi.
 */
export const jitsiJaaSConfig = {
  appId: env.VITE_JITSI_APP_ID,
  jwt: env.VITE_JITSI_JWT,
  tenant: env.VITE_JITSI_TENANT,
  // JaaS uses 8x8.vc domain
  // Only enable JaaS if App ID, JWT, and Tenant are all provided
  // JaaS requires all three to work properly
  isJaaS: !!env.VITE_JITSI_APP_ID && !!env.VITE_JITSI_JWT && !!env.VITE_JITSI_TENANT,
  // JWT is required for JaaS to work properly
  hasJWT: !!env.VITE_JITSI_JWT,
  // Check if JaaS is partially configured
  isPartiallyConfigured: !!env.VITE_JITSI_APP_ID && (!env.VITE_JITSI_JWT || !env.VITE_JITSI_TENANT),
}

/**
 * Default Jitsi configuration
 * 
 * Default configuration options for Jitsi meetings.
 */
export const defaultJitsiConfig = {
  startWithAudioMuted: false,
  startWithVideoMuted: false,
  enableWelcomePage: false,
  enableClosePage: false,
  disableDeepLinking: true,
  disableInviteFunctions: true,
  disableRemoteMute: false,
  enableLayerSuspension: true,
  channelLastN: -1, // Unlimited participants
  p2p: {
    enabled: false, // Disable P2P for better reliability in interviews
  },
  // Disable lobby/prejoin to prevent members-only errors
  enableLobbyChat: false,
  enablePrejoinPage: false,
  enableNoAudioDetection: false,
  enableNoisyMicDetection: false,
  // Suppress warnings for optional features
  features: {
    'speaker-selection': false, // Disable speaker selection feature to suppress warning
  },
}

/**
 * Default Jitsi interface configuration
 * 
 * UI customization options for Jitsi meetings.
 */
export const defaultJitsiInterfaceConfig = {
  TOOLBAR_BUTTONS: [
    'microphone',
    'camera',
    'closedcaptions',
    'desktop',
    'fullscreen',
    'fodeviceselection',
    'hangup',
    'chat',
    'settings',
    'raisehand',
    'videoquality',
    'filmstrip',
    'invite',
    'feedback',
    'stats',
    'shortcuts',
    'tileview',
    'videobackgroundblur',
    'download',
    'help',
    'mute-everyone',
    'security',
  ],
  SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
  DISABLE_PRESENCE_STATUS: false,
  DISABLE_FOCUS_INDICATOR: false,
  DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
  HIDE_INVITE_MORE_HEADER: true,
}

