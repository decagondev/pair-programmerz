import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge.
 * 
 * This utility function combines clsx (for conditional classes) and tailwind-merge
 * (for resolving Tailwind class conflicts) to create a single className string.
 * 
 * @param inputs - Class values (strings, objects, arrays, or undefined)
 * @returns Merged and deduplicated className string
 * 
 * @example
 * ```tsx
 * cn('base-class', isActive && 'active-class', { 'conditional': condition })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
