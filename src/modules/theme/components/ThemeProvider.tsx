import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * Theme mode type
 */
type Theme = 'light' | 'dark' | 'system'

/**
 * Theme context type
 */
interface ThemeContextType {
  /**
   * Current theme mode
   */
  theme: Theme
  /**
   * Set theme mode
   */
  setTheme: (theme: Theme) => void
  /**
   * Resolved theme (light or dark, not system)
   */
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Props for ThemeProvider component
 */
interface ThemeProviderProps {
  /**
   * Child components
   */
  children: ReactNode
  /**
   * Default theme (defaults to 'system')
   */
  defaultTheme?: Theme
  /**
   * Storage key for persisting theme preference (defaults to 'theme')
   */
  storageKey?: string
}

/**
 * Theme provider component
 * 
 * Manages theme state and applies dark mode class to the document root.
 * Persists theme preference to localStorage.
 * 
 * @param props - Component props
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored
      }
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove('light', 'dark')

    // Determine resolved theme
    let resolved: 'light' | 'dark'
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme
    }

    // Apply theme class
    root.classList.add(resolved)
    setResolvedTheme(resolved)
  }, [theme])

  useEffect(() => {
    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        const resolved = e.matches ? 'dark' : 'light'
        root.classList.add(resolved)
        setResolvedTheme(resolved)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const value: ThemeContextType = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme)
      }
    },
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access theme context
 * 
 * @returns Theme context value
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

