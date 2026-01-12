import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore, type Theme } from '@/stores/themeStore'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore()

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Hell' },
    { value: 'dark', icon: Moon, label: 'Dunkel' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  return (
    <div className={cn('flex items-center', className)}>
      {showLabel && (
        <span className="text-sm text-muted-foreground mr-3">Erscheinungsbild</span>
      )}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'p-2 rounded-md transition-colors',
              theme === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={label}
            aria-label={`${label} aktivieren`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  )
}
