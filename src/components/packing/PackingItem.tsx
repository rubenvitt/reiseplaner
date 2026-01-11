'use client'

import { Pencil, Trash2, Star } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PackingItem as PackingItemType } from '@/types'

interface PackingItemProps {
  item: PackingItemType
  onToggle: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function PackingItem({
  item,
  onToggle,
  onEdit,
  onDelete,
}: PackingItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors',
        'hover:bg-accent/50',
        item.isPacked && 'bg-muted/50'
      )}
    >
      <Checkbox
        checked={item.isPacked}
        onCheckedChange={onToggle}
        aria-label={`${item.name} als gepackt markieren`}
      />

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium truncate',
              item.isPacked && 'line-through text-muted-foreground'
            )}
          >
            {item.name}
          </span>

          {item.quantity > 1 && (
            <span className="text-sm text-muted-foreground shrink-0">
              x{item.quantity}
            </span>
          )}

          {item.isEssential && (
            <Badge
              variant="secondary"
              className="shrink-0 gap-1 text-amber-600 bg-amber-100 border-amber-200"
            >
              <Star className="h-3 w-3 fill-current" />
              Wichtig
            </Badge>
          )}
        </div>

        {item.notes && (
          <p className="text-xs text-muted-foreground truncate">
            {item.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            aria-label={`${item.name} bearbeiten`}
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
            aria-label={`${item.name} loeschen`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
