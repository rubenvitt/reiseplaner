import { motion } from 'framer-motion'
import {
  Camera,
  Utensils,
  Bus,
  Activity as ActivityIcon,
  Palmtree,
  ShoppingBag,
  MoreHorizontal,
  Clock,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, ActivityCategory } from '@/types'

interface CalendarEventProps {
  activity: Activity
  variant?: 'compact' | 'full' | 'timeline'
  onClick?: () => void
  isDragging?: boolean
}

const categoryIcons: Record<ActivityCategory, React.ElementType> = {
  sightseeing: Camera,
  food: Utensils,
  transport: Bus,
  activity: ActivityIcon,
  relaxation: Palmtree,
  shopping: ShoppingBag,
  other: MoreHorizontal,
}

const categoryColors: Record<ActivityCategory, { bg: string; text: string; border: string; dot: string }> = {
  sightseeing: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  food: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
  },
  transport: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  activity: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
  },
  relaxation: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  shopping: {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
    dot: 'bg-pink-500',
  },
  other: {
    bg: 'bg-gray-50 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
  },
}

const categoryLabels: Record<ActivityCategory, string> = {
  sightseeing: 'Sehenswürdigkeit',
  food: 'Essen',
  transport: 'Transport',
  activity: 'Aktivität',
  relaxation: 'Entspannung',
  shopping: 'Shopping',
  other: 'Sonstiges',
}

export function CalendarEvent({
  activity,
  variant = 'compact',
  onClick,
  isDragging = false,
}: CalendarEventProps) {
  const Icon = categoryIcons[activity.category]
  const colors = categoryColors[activity.category]

  const formatTime = (time: string) => time.slice(0, 5)

  // Kompakte Ansicht (für Monat)
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'group relative flex items-center gap-1 px-1.5 py-0.5 rounded text-xs cursor-pointer',
          'transition-all duration-200',
          colors.bg,
          colors.text,
          isDragging && 'opacity-50 shadow-lg'
        )}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />
        <span className="truncate">{activity.title}</span>

        {/* Tooltip */}
        <div
          className={cn(
            'absolute left-0 top-full mt-1 z-50 p-2 rounded-lg shadow-lg',
            'bg-popover text-popover-foreground border',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-200 min-w-[180px]'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">{activity.title}</span>
          </div>
          {activity.startTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(activity.startTime)}
              {activity.endTime && ` - ${formatTime(activity.endTime)}`}
            </div>
          )}
          {activity.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{activity.location}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Vollständige Ansicht (für Woche)
  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-2 rounded-lg border cursor-pointer',
          'transition-all duration-200',
          colors.bg,
          colors.border,
          isDragging && 'opacity-50 shadow-lg ring-2 ring-primary'
        )}
        onClick={onClick}
        whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start gap-2">
          <div className={cn('p-1.5 rounded', colors.bg)}>
            <Icon className={cn('h-4 w-4', colors.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn('font-medium text-sm truncate', colors.text, activity.isCompleted && 'line-through opacity-60')}>
              {activity.title}
            </h4>
            {activity.startTime && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTime(activity.startTime)}
                {activity.endTime && ` - ${formatTime(activity.endTime)}`}
              </p>
            )}
            {activity.location && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {activity.location}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Timeline-Ansicht
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'h-full p-2 rounded-lg border cursor-move',
        'transition-all duration-200',
        colors.bg,
        colors.border,
        isDragging && 'opacity-70 shadow-xl ring-2 ring-primary z-50'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2 h-full">
        <div className={cn('p-1 rounded flex-shrink-0', colors.bg)}>
          <Icon className={cn('h-4 w-4', colors.text)} />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className={cn('font-medium text-sm truncate', colors.text)}>
            {activity.title}
          </h4>
          {activity.startTime && (
            <p className="text-xs text-muted-foreground">
              {formatTime(activity.startTime)}
              {activity.endTime && ` - ${formatTime(activity.endTime)}`}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Export helper für Kategorie-Punkt (z.B. für MonthView)
export function CategoryDot({ category }: { category: ActivityCategory }) {
  const colors = categoryColors[category]
  return (
    <span
      className={cn('inline-block w-2 h-2 rounded-full', colors.dot)}
      title={categoryLabels[category]}
    />
  )
}

export { categoryColors, categoryIcons, categoryLabels }
