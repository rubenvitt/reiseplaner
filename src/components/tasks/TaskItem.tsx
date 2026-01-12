import { format, isPast, isToday } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'
import type { Task } from '@/types'
import { taskCategoryLabels, taskPriorityLabels } from '@/types'
import { cn } from '@/lib/utils'
import { Badge, Button } from '@/components/ui'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false)

  const isOverdue = task.deadline && task.status === 'open' && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline))
  const isDueToday = task.deadline && isToday(new Date(task.deadline))

  const priorityColors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 rounded-lg border transition-colors',
        task.status === 'completed'
          ? 'bg-muted/50 border-border'
          : isOverdue
          ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'
          : 'bg-card border-border hover:bg-accent/50'
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'mt-0.5 flex-shrink-0 transition-colors',
          task.status === 'completed'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-primary'
        )}
      >
        {task.status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                'font-medium',
                task.status === 'completed'
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-40 bg-popover border border-border rounded-lg shadow-lg py-1">
                  <button
                    onClick={() => {
                      onEdit(task)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => {
                      onDelete(task.id)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Löschen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {taskPriorityLabels[task.priority]}
          </Badge>
          <Badge variant="outline">
            {taskCategoryLabels[task.category]}
          </Badge>

          {task.deadline && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue
                  ? 'text-red-600 dark:text-red-400'
                  : isDueToday
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-muted-foreground'
              )}
            >
              {isOverdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : isDueToday ? (
                <Clock className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span>
                {isOverdue
                  ? 'Überfällig'
                  : isDueToday
                  ? 'Heute fällig'
                  : format(new Date(task.deadline), 'dd. MMM yyyy', { locale: de })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
