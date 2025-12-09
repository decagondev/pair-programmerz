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
 */
export const jitsiDomain = env.VITE_JITSI_DOMAIN || 'meet.jit.si'

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

