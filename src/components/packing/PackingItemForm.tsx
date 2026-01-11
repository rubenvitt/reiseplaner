'use client'

import { useForm } from 'react-hook-form'
import { Button, Input, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PackingItem } from '@/types'

export interface PackingItemFormData {
  name: string
  quantity: number
  isEssential: boolean
  notes?: string
}

export interface PackingItemFormProps {
  item?: PackingItem
  onSubmit: (data: PackingItemFormData) => void
  onCancel: () => void
}

export function PackingItemForm({
  item,
  onSubmit,
  onCancel,
}: PackingItemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackingItemFormData>({
    defaultValues: {
      name: item?.name ?? '',
      quantity: item?.quantity ?? 1,
      isEssential: item?.isEssential ?? false,
      notes: item?.notes ?? '',
    },
  })

  const isEssential = watch('isEssential')

  const handleFormSubmit = (data: PackingItemFormData) => {
    const cleanedData: PackingItemFormData = {
      ...data,
      quantity: Number(data.quantity),
      notes: data.notes || undefined,
    }
    onSubmit(cleanedData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          placeholder="z.B. T-Shirt"
          {...register('name', { required: 'Name ist erforderlich' })}
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Anzahl */}
      <div className="space-y-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Anzahl <span className="text-destructive">*</span>
        </label>
        <Input
          id="quantity"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          {...register('quantity', {
            required: 'Anzahl ist erforderlich',
            min: { value: 1, message: 'Anzahl muss mindestens 1 sein' },
            valueAsNumber: true,
          })}
          className={cn(errors.quantity && 'border-destructive')}
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      {/* Wichtig */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="isEssential"
          checked={isEssential}
          onCheckedChange={(checked) => setValue('isEssential', checked)}
        />
        <label htmlFor="isEssential" className="text-sm font-medium cursor-pointer">
          Wichtig / Unverzichtbar
        </label>
      </div>

      {/* Notizen */}
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notizen
        </label>
        <textarea
          id="notes"
          placeholder="Optionale Anmerkungen"
          rows={3}
          {...register('notes')}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {item ? 'Speichern' : 'Hinzufuegen'}
        </Button>
      </div>
    </form>
  )
}
