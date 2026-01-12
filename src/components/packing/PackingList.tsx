'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, FileText, CheckCircle2 } from 'lucide-react'
import { usePackingStore } from '@/stores'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { PackingCategory } from './PackingCategory'
import { PackingCategoryForm, type PackingCategoryFormData } from './PackingCategoryForm'
import { PackingItemForm, type PackingItemFormData } from './PackingItemForm'
import { PackingTemplates, type PackingTemplate } from './PackingTemplates'
import { cn } from '@/lib/utils'
import type { PackingCategory as PackingCategoryType, PackingItem as PackingItemType } from '@/types'

interface PackingListProps {
  tripId: string
}

type DialogMode =
  | { type: 'none' }
  | { type: 'createCategory' }
  | { type: 'editCategory'; category: PackingCategoryType }
  | { type: 'createItem'; categoryId: string }
  | { type: 'editItem'; categoryId: string; item: PackingItemType }
  | { type: 'templates' }

export function PackingList({ tripId }: PackingListProps) {
  const {
    getPackingListsByTrip,
    addPackingList,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPacked,
    getPackedItemsCount,
  } = usePackingStore()

  const [dialogMode, setDialogMode] = useState<DialogMode>({ type: 'none' })

  // Hole oder erstelle PackingList für diese Reise
  const packingLists = getPackingListsByTrip(tripId)

  // Berechne listId synchron statt in einem Effect
  const listId = useMemo(() => {
    if (packingLists.length === 0) {
      return null
    }
    return packingLists[0].id
  }, [packingLists])

  // Erstelle automatisch eine leere Liste falls keine existiert
  useEffect(() => {
    if (packingLists.length === 0) {
      addPackingList({
        tripId,
        name: 'Packliste',
      })
    }
  }, [tripId, packingLists.length, addPackingList])

  const currentList = useMemo(() => {
    return packingLists.find((list) => list.id === listId)
  }, [packingLists, listId])

  // Berechne Fortschritt
  const progress = useMemo(() => {
    if (!listId) return { packed: 0, total: 0, percentage: 0 }
    const { packed, total } = getPackedItemsCount(listId)
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0
    return { packed, total, percentage }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- currentList triggers recalc when items change
  }, [listId, getPackedItemsCount, currentList])

  const sortedCategories = useMemo(() => {
    if (!currentList) return []
    return [...currentList.categories].sort((a, b) => a.order - b.order)
  }, [currentList])

  // Dialog Handlers
  const closeDialog = () => setDialogMode({ type: 'none' })

  const handleCreateCategory = (data: PackingCategoryFormData) => {
    if (!listId) return
    addCategory(listId, { name: data.name, icon: data.icon })
    closeDialog()
  }

  const handleEditCategory = (data: PackingCategoryFormData) => {
    if (!listId || dialogMode.type !== 'editCategory') return
    updateCategory(listId, dialogMode.category.id, { name: data.name, icon: data.icon })
    closeDialog()
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (!listId) return
    deleteCategory(listId, categoryId)
  }

  const handleCreateItem = (data: PackingItemFormData) => {
    if (!listId || dialogMode.type !== 'createItem') return
    addItem(listId, dialogMode.categoryId, {
      name: data.name,
      quantity: data.quantity,
      isPacked: false,
      isEssential: data.isEssential,
      notes: data.notes,
    })
    closeDialog()
  }

  const handleEditItem = (data: PackingItemFormData) => {
    if (!listId || dialogMode.type !== 'editItem') return
    updateItem(listId, dialogMode.categoryId, dialogMode.item.id, {
      name: data.name,
      quantity: data.quantity,
      isEssential: data.isEssential,
      notes: data.notes,
    })
    closeDialog()
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (!listId) return
    deleteItem(listId, categoryId, itemId)
  }

  const handleToggleItem = (categoryId: string, itemId: string) => {
    if (!listId) return
    toggleItemPacked(listId, categoryId, itemId)
  }

  const handleSelectTemplate = (template: PackingTemplate) => {
    if (!listId) return

    // Für jede Kategorie im Template
    template.categories.forEach((templateCategory) => {
      const categoryId = addCategory(listId, {
        name: templateCategory.name,
        icon: templateCategory.icon,
      })

      // Für jedes Item in der Kategorie
      templateCategory.items.forEach((templateItem) => {
        addItem(listId, categoryId, {
          name: templateItem.name,
          quantity: templateItem.quantity,
          isPacked: false,
          isEssential: templateItem.isEssential,
        })
      })
    })

    closeDialog()
  }

  // Render Fortschritts-Farbe
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-yellow-500'
    if (percentage >= 50) return 'bg-orange-500'
    return 'bg-primary'
  }

  if (!currentList) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <p>Packliste wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Fortschritts-Header */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={cn(
                'h-5 w-5',
                progress.percentage === 100 ? 'text-green-500' : 'text-muted-foreground'
              )}
            />
            <span className="font-semibold">
              {progress.packed}/{progress.total} Items gepackt ({progress.percentage}%)
            </span>
          </div>
          {progress.percentage === 100 && progress.total > 0 && (
            <span className="text-sm text-green-600 font-medium">
              Alles gepackt!
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              getProgressColor(progress.percentage)
            )}
            style={{ width: `${progress.percentage}%` }}
            role="progressbar"
            aria-valuenow={progress.packed}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label={`${progress.packed} von ${progress.total} Items gepackt`}
          />
        </div>
      </div>

      {/* Aktions-Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setDialogMode({ type: 'createCategory' })}>
          <Plus className="mr-2 h-4 w-4" />
          Kategorie hinzufügen
        </Button>
        <Button
          variant="outline"
          onClick={() => setDialogMode({ type: 'templates' })}
        >
          <FileText className="mr-2 h-4 w-4" />
          Aus Vorlage erstellen
        </Button>
      </div>

      {/* Kategorien-Liste */}
      {sortedCategories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Noch keine Kategorien</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Füge deine erste Kategorie hinzu oder starte mit einer Vorlage.
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogMode({ type: 'createCategory' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Kategorie erstellen
            </Button>
            <Button onClick={() => setDialogMode({ type: 'templates' })}>
              <FileText className="mr-2 h-4 w-4" />
              Vorlage verwenden
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map((category) => (
            <PackingCategory
              key={category.id}
              category={category}
              onAddItem={() =>
                setDialogMode({ type: 'createItem', categoryId: category.id })
              }
              onEditItem={(item) =>
                setDialogMode({
                  type: 'editItem',
                  categoryId: category.id,
                  item,
                })
              }
              onDeleteItem={(itemId) => handleDeleteItem(category.id, itemId)}
              onToggleItem={(itemId) => handleToggleItem(category.id, itemId)}
              onEditCategory={() =>
                setDialogMode({ type: 'editCategory', category })
              }
              onDeleteCategory={() => handleDeleteCategory(category.id)}
            />
          ))}
        </div>
      )}

      {/* Dialog für Kategorie erstellen */}
      <Dialog
        open={dialogMode.type === 'createCategory'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Kategorie erstellen</DialogTitle>
            <DialogDescription>
              Erstelle eine neue Kategorie für deine Packliste.
            </DialogDescription>
          </DialogHeader>
          <PackingCategoryForm
            onSubmit={handleCreateCategory}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog für Kategorie bearbeiten */}
      <Dialog
        open={dialogMode.type === 'editCategory'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategorie bearbeiten</DialogTitle>
            <DialogDescription>
              Ändere den Namen oder das Icon der Kategorie.
            </DialogDescription>
          </DialogHeader>
          {dialogMode.type === 'editCategory' && (
            <PackingCategoryForm
              category={dialogMode.category}
              onSubmit={handleEditCategory}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog für Item erstellen */}
      <Dialog
        open={dialogMode.type === 'createItem'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Item hinzufügen</DialogTitle>
            <DialogDescription>
              Füge ein neues Item zur Kategorie hinzu.
            </DialogDescription>
          </DialogHeader>
          <PackingItemForm onSubmit={handleCreateItem} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>

      {/* Dialog für Item bearbeiten */}
      <Dialog
        open={dialogMode.type === 'editItem'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item bearbeiten</DialogTitle>
            <DialogDescription>
              Ändere die Details dieses Items.
            </DialogDescription>
          </DialogHeader>
          {dialogMode.type === 'editItem' && (
            <PackingItemForm
              item={dialogMode.item}
              onSubmit={handleEditItem}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog für Templates */}
      <Dialog
        open={dialogMode.type === 'templates'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vorlage auswählen</DialogTitle>
            <DialogDescription>
              Wähle eine Vorlage, um deine Packliste schnell zu befüllen.
            </DialogDescription>
          </DialogHeader>
          <PackingTemplates
            onSelect={handleSelectTemplate}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
