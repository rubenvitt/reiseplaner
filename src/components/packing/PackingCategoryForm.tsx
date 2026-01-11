'use client'

import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PackingCategory } from '@/types'

export interface PackingCategoryFormData {
  name: string
  icon?: string
}

export interface PackingCategoryFormProps {
  category?: PackingCategory
  onSubmit: (data: PackingCategoryFormData) => void
  onCancel: () => void
}

export function PackingCategoryForm({
  category,
  onSubmit,
  onCancel,
}: PackingCategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PackingCategoryFormData>({
    defaultValues: {
      name: category?.name ?? '',
      icon: category?.icon ?? '',
    },
  })

  const handleFormSubmit = (data: PackingCategoryFormData) => {
    const cleanedData: PackingCategoryFormData = {
      ...data,
      icon: data.icon || undefined,
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
          placeholder="z.B. Kleidung"
          {...register('name', { required: 'Name ist erforderlich' })}
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <label htmlFor="icon" className="text-sm font-medium">
          Icon
        </label>
        <Input
          id="icon"
          placeholder="z.B. ein Emoji wie ein Koffer"
          {...register('icon')}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Ein Emoji oder Symbol zur Darstellung der Kategorie
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {category ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  )
}
