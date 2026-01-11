'use client'

import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/ui'
import { Activity, ActivityCategory } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: 'sightseeing', label: 'Sehenswürdigkeit' },
  { value: 'food', label: 'Essen & Trinken' },
  { value: 'transport', label: 'Transport' },
  { value: 'activity', label: 'Aktivität' },
  { value: 'relaxation', label: 'Entspannung' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Sonstiges' },
]

export interface ActivityFormData {
  title: string
  description?: string
  startTime?: string
  endTime?: string
  location?: string
  category: ActivityCategory
  cost?: number
  bookingReference?: string
}

export interface ActivityFormProps {
  activity?: Activity
  onSubmit: (data: ActivityFormData) => void
  onCancel: () => void
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    defaultValues: {
      title: activity?.title ?? '',
      description: activity?.description ?? '',
      startTime: activity?.startTime ?? '',
      endTime: activity?.endTime ?? '',
      location: activity?.location ?? '',
      category: activity?.category ?? 'other',
      cost: activity?.cost,
      bookingReference: activity?.bookingReference ?? '',
    },
  })

  const startTime = watch('startTime')

  const validateEndTime = (value: string | undefined) => {
    if (!value || !startTime) return true
    return value >= startTime || 'Endzeit muss nach der Startzeit liegen'
  }

  const handleFormSubmit = (data: ActivityFormData) => {
    const cleanedData: ActivityFormData = {
      ...data,
      description: data.description || undefined,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
      location: data.location || undefined,
      cost: data.cost ? Number(data.cost) : undefined,
      bookingReference: data.bookingReference || undefined,
    }
    onSubmit(cleanedData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Titel */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titel <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          placeholder="Name der Aktivität"
          {...register('title', { required: 'Titel ist erforderlich' })}
          className={cn(errors.title && 'border-destructive')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Beschreibung */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Beschreibung
        </label>
        <textarea
          id="description"
          placeholder="Optionale Beschreibung"
          rows={3}
          {...register('description')}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Zeitraum */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startTime" className="text-sm font-medium">
            Startzeit
          </label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endTime" className="text-sm font-medium">
            Endzeit
          </label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime', { validate: validateEndTime })}
            className={cn(errors.endTime && 'border-destructive')}
          />
          {errors.endTime && (
            <p className="text-sm text-destructive">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Ort */}
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Ort
        </label>
        <Input
          id="location"
          placeholder="Adresse oder Ortsname"
          {...register('location')}
        />
      </div>

      {/* Kategorie */}
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Kategorie
        </label>
        <select
          id="category"
          {...register('category')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kosten */}
      <div className="space-y-2">
        <label htmlFor="cost" className="text-sm font-medium">
          Kosten (EUR)
        </label>
        <Input
          id="cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          {...register('cost', { valueAsNumber: true })}
        />
      </div>

      {/* Buchungsreferenz */}
      <div className="space-y-2">
        <label htmlFor="bookingReference" className="text-sm font-medium">
          Buchungsreferenz
        </label>
        <Input
          id="bookingReference"
          placeholder="Buchungsnummer oder Referenz"
          {...register('bookingReference')}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {activity ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  )
}
