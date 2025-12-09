/**
 * Sound alert utilities
 * 
 * Provides functions to play subtle sound alerts for timer warnings.
 * Uses Web Audio API to generate chime sounds.
 */

/**
 * Play a subtle chime sound
 * 
 * Generates a simple tone using Web Audio API.
 * 
 * @param frequency - Frequency in Hz (default: 800)
 * @param duration - Duration in milliseconds (default: 200)
 * @param volume - Volume (0-1, default: 0.3)
 */
export function playChime(
  frequency: number = 800,
  duration: number = 200,
  volume: number = 0.3
): void {
  try {
    // Check if Web Audio API is available
    if (typeof window === 'undefined' || !window.AudioContext) {
      return
    }

    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // Configure oscillator
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency

    // Configure gain (volume)
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (error) {
    // Silently fail if audio cannot be played (e.g., user hasn't interacted with page)
    console.debug('Could not play sound alert:', error)
  }
}

/**
 * Play warning alert (5 minutes remaining)
 * 
 * Plays a subtle single chime.
 */
export function playWarningAlert(): void {
  playChime(800, 200, 0.3)
}

/**
 * Play critical alert (2 minutes remaining)
 * 
 * Plays a slightly more urgent double chime.
 */
export function playCriticalAlert(): void {
  playChime(900, 150, 0.4)
  setTimeout(() => {
    playChime(900, 150, 0.4)
  }, 200)
}

/**
 * Play expired alert (0 minutes remaining)
 * 
 * Plays a more urgent triple chime.
 */
export function playExpiredAlert(): void {
  playChime(1000, 200, 0.5)
  setTimeout(() => {
    playChime(1000, 200, 0.5)
  }, 250)
  setTimeout(() => {
    playChime(1000, 200, 0.5)
  }, 500)
}

