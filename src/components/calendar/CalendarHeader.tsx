import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export type ViewMode = 'month' | 'week' | 'timeline'

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

const viewModeConfig: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
  { mode: 'month', label: 'Monat', icon: Calendar },
  { mode: 'week', label: 'Woche', icon: CalendarDays },
  { mode: 'timeline', label: 'Timeline', icon: Clock },
]

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const getDateLabel = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: de })
      case 'week':
        return format(currentDate, "'KW' w, MMMM yyyy", { locale: de })
      case 'timeline':
        return format(currentDate, 'EEEE, d. MMMM yyyy', { locale: de })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
      {/* Navigation und Datum */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            aria-label="Zurück"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            aria-label="Vor"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="ml-2"
        >
          Heute
        </Button>

        <motion.h2
          key={currentDate.toISOString()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold ml-4 capitalize"
        >
          {getDateLabel()}
        </motion.h2>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {viewModeConfig.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium',
              'transition-colors duration-200',
              viewMode === mode
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {viewMode === mode && (
              <motion.div
                layoutId="viewModeIndicator"
                className="absolute inset-0 bg-background rounded-md shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
