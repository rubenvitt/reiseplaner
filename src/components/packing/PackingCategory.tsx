import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { PackingItem } from './PackingItem'
import { cn } from '@/lib/utils'
import type { PackingCategory as PackingCategoryType, PackingItem as PackingItemType } from '@/types'

interface PackingCategoryProps {
  category: PackingCategoryType
  onAddItem: () => void
  onEditItem: (item: PackingItemType) => void
  onDeleteItem: (itemId: string) => void
  onToggleItem: (itemId: string) => void
  onEditCategory?: () => void
  onDeleteCategory?: () => void
}

export function PackingCategory({
  category,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
  onEditCategory,
  onDeleteCategory,
}: PackingCategoryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sortedItems = [...category.items].sort((a, b) => a.order - b.order)
  const packedCount = category.items.filter((item) => item.isPacked).length
  const totalCount = category.items.length
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-2">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'p-1 rounded transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              )}
              aria-label={isCollapsed ? 'Kategorie erweitern' : 'Kategorie einklappen'}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {/* Category Icon */}
            {category.icon ? (
              <span className="text-lg" role="img" aria-hidden="true">
                {category.icon}
              </span>
            ) : (
              <Package className="h-5 w-5 text-muted-foreground" />
            )}

            {/* Category Name */}
            <h3 className="font-semibold text-sm truncate">{category.name}</h3>

            {/* Progress Counter */}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {packedCount}/{totalCount} gepackt
            </span>
          </div>

          {/* Category Actions */}
          <div className="flex items-center gap-1">
            {onEditCategory && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEditCategory}
                aria-label="Kategorie bearbeiten"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDeleteCategory && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onDeleteCategory}
                aria-label="Kategorie löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              progressPercentage === 100
                ? 'bg-green-500'
                : progressPercentage > 0
                  ? 'bg-primary'
                  : 'bg-muted'
            )}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={packedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label={`${packedCount} von ${totalCount} Items gepackt`}
          />
        </div>
      </CardHeader>

      {/* Content - Collapsible */}
      {!isCollapsed && (
        <CardContent className="space-y-2">
          {/* Items List */}
          {sortedItems.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Noch keine Items in dieser Kategorie
            </p>
          ) : (
            sortedItems.map((item) => (
              <PackingItem
                key={item.id}
                item={item}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item.id)}
                onToggle={() => onToggleItem(item.id)}
              />
            ))
          )}

          {/* Add Item Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onAddItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Item hinzufügen
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
