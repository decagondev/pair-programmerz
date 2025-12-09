import { useEffect } from 'react'

/**
 * Options for keyboard shortcut hook
 */
interface UseKeyboardShortcutOptions {
  /**
   * Whether the shortcut is enabled
   */
  enabled?: boolean
  /**
   * Whether to prevent default behavior
   */
  preventDefault?: boolean
  /**
   * Whether to stop propagation
   */
  stopPropagation?: boolean
}

/**
 * Keyboard shortcut hook
 * 
 * Registers a keyboard shortcut listener that calls a callback when the shortcut is pressed.
 * Supports Cmd/Ctrl modifiers and automatically cleans up on unmount.
 * 
 * @param keys - Array of keys to match (e.g., ['Meta', 'Enter'] or ['Control', 'Enter'])
 * @param callback - Function to call when shortcut is pressed
 * @param options - Additional options
 * 
 * @example
 * ```tsx
 * useKeyboardShortcut(['Meta', 'Enter'], () => {
 *   handleSubmit()
 * }, { preventDefault: true })
 * ```
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
): void {
  const { enabled = true, preventDefault = true, stopPropagation = false } = options

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all required keys are pressed
      const allKeysPressed = keys.every((key) => {
        if (key === 'Meta' || key === 'Cmd') {
          return event.metaKey || event.ctrlKey
        }
        if (key === 'Control' || key === 'Ctrl') {
          return event.ctrlKey
        }
        if (key === 'Shift') {
          return event.shiftKey
        }
        if (key === 'Alt') {
          return event.altKey
        }
        return event.key === key || event.code === key
      })

      // Also check that modifier keys not in the keys array are not pressed
      const hasExtraModifiers =
        (!keys.includes('Meta') && !keys.includes('Cmd') && !keys.includes('Control') && !keys.includes('Ctrl') && (event.metaKey || event.ctrlKey)) ||
        (!keys.includes('Shift') && event.shiftKey) ||
        (!keys.includes('Alt') && event.altKey)

      if (allKeysPressed && !hasExtraModifiers) {
        if (preventDefault) {
          event.preventDefault()
        }
        if (stopPropagation) {
          event.stopPropagation()
        }
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keys, callback, enabled, preventDefault, stopPropagation])
}

