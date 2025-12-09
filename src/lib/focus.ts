/**
 * Focus management utilities
 * 
 * Provides utilities for managing focus in modals, dialogs, and other interactive components.
 */

let previousActiveElement: HTMLElement | null = null

/**
 * Get all focusable elements within a container
 * 
 * @param container - Container element to search within
 * @returns Array of focusable elements
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (el) => {
      // Filter out hidden elements
      return (
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        !el.hasAttribute('disabled') &&
        window.getComputedStyle(el).visibility !== 'hidden'
      )
    }
  )
}

/**
 * Trap focus within a container element
 * 
 * Prevents focus from escaping the container and cycles focus between focusable elements.
 * 
 * @param container - Container element to trap focus within
 * @returns Cleanup function to remove focus trap
 */
export function trapFocus(container: HTMLElement): () => void {
  // Store the previously active element
  previousActiveElement = (document.activeElement as HTMLElement) || null

  // Get all focusable elements
  const focusableElements = getFocusableElements(container)

  if (focusableElements.length === 0) {
    return () => {
      // No cleanup needed
    }
  }

  // Focus the first element
  const firstElement = focusableElements[0]
  firstElement.focus()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return
    }

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    if (event.shiftKey) {
      // Shift + Tab: move backwards
      if (currentIndex === 0 || currentIndex === -1) {
        event.preventDefault()
        focusableElements[focusableElements.length - 1].focus()
      } else {
        event.preventDefault()
        focusableElements[currentIndex - 1].focus()
      }
    } else {
      // Tab: move forwards
      if (currentIndex === focusableElements.length - 1 || currentIndex === -1) {
        event.preventDefault()
        focusableElements[0].focus()
      } else {
        event.preventDefault()
        focusableElements[currentIndex + 1].focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Return focus to the previously active element
 * 
 * Restores focus to the element that was active before a modal/dialog was opened.
 */
export function returnFocus(): void {
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus()
    previousActiveElement = null
  }
}

/**
 * Focus the first focusable element in a container
 * 
 * @param container - Container element to focus within
 */
export function focusFirst(container: HTMLElement): void {
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }
}

/**
 * Focus the last focusable element in a container
 * 
 * @param container - Container element to focus within
 */
export function focusLast(container: HTMLElement): void {
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus()
  }
}

/**
 * Store the currently active element for later restoration
 * 
 * Call this before opening a modal/dialog to save the current focus.
 */
export function saveActiveElement(): void {
  previousActiveElement = (document.activeElement as HTMLElement) || null
}

