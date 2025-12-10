import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../hooks/useTheme'

/**
 * Theme toggle component
 * 
 * Button that toggles between light and dark themes.
 * Cycles through: light -> dark -> system
 * 
 * @param props - Button props (size, variant, etc.)
 */
export function ThemeToggle({ ...props }: React.ComponentProps<typeof Button>) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleToggle = () => {
    // Cycle through: light -> dark -> system
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

