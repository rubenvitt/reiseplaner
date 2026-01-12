import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Clock,
  MapPin,
  Wallet,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Badge, Button, Checkbox } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Activity, ActivityCategory } from '@/types'

interface ActivityItemProps {
  activity: Activity
  onEdit?: () => void
  onDelete?: () => void
  onToggleComplete?: () => void
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

const categoryColors: Record<ActivityCategory, string> = {
  sightseeing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  food: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  transport: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  activity: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  relaxation: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  shopping: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  other: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
}

export function ActivityItem({
  activity,
  onEdit,
  onDelete,
  onToggleComplete,
}: ActivityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-card rounded-lg border',
        'transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg z-50',
        activity.isCompleted && 'bg-muted/50'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'cursor-grab active:cursor-grabbing p-1 rounded',
          'text-muted-foreground hover:text-foreground hover:bg-accent',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
        )}
        aria-label="Aktivität verschieben"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={activity.isCompleted}
        onCheckedChange={onToggleComplete}
        aria-label={
          activity.isCompleted
            ? 'Als nicht erledigt markieren'
            : 'Als erledigt markieren'
        }
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={cn(
              'font-medium text-sm truncate',
              activity.isCompleted && 'line-through text-muted-foreground'
            )}
          >
            {activity.title}
          </h4>
          <Badge
            className={cn(
              'text-xs',
              categoryColors[activity.category],
              activity.isCompleted && 'opacity-60'
            )}
          >
            {categoryLabels[activity.category]}
          </Badge>
        </div>

        <div
          className={cn(
            'flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap',
            activity.isCompleted && 'line-through'
          )}
        >
          {/* Time */}
          {(activity.startTime || activity.endTime) && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.startTime && formatTime(activity.startTime)}
              {activity.startTime && activity.endTime && ' - '}
              {activity.endTime && formatTime(activity.endTime)}
            </span>
          )}

          {/* Location */}
          {activity.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{activity.location}</span>
            </span>
          )}

          {/* Cost */}
          {activity.cost !== undefined && activity.cost > 0 && (
            <span className="flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              {formatCurrency(activity.cost)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            aria-label="Aktivität bearbeiten"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            aria-label="Aktivität löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
