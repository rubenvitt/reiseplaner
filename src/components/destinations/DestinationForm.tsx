'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { geocodeAddress } from '@/services/geocoding'
import type { Destination } from '@/types'
import { cn } from '@/lib/utils'

export interface DestinationFormData {
  name: string
  country: string
  arrivalDate?: string
  departureDate?: string
  notes?: string
  latitude?: number
  longitude?: number
}

export interface DestinationFormProps {
  destination?: Destination
  onSubmit: (data: DestinationFormData) => void
  onCancel: () => void
}

export function DestinationForm({
  destination,
  onSubmit,
  onCancel,
}: DestinationFormProps) {
  const isEditMode = Boolean(destination)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormData>({
    defaultValues: {
      name: destination?.name ?? '',
      country: destination?.country ?? '',
      arrivalDate: destination?.arrivalDate ?? '',
      departureDate: destination?.departureDate ?? '',
      notes: destination?.notes ?? '',
      latitude: destination?.latitude,
      longitude: destination?.longitude,
    },
  })

  const arrivalDate = watch('arrivalDate')

  const handleFormSubmit = async (data: DestinationFormData) => {
    let latitude = destination?.latitude
    let longitude = destination?.longitude

    // Geocode wenn Name oder Land sich geändert haben oder noch keine Koordinaten vorhanden sind
    const nameChanged = data.name !== destination?.name
    const countryChanged = data.country !== destination?.country
    const needsGeocoding = !latitude || !longitude || nameChanged || countryChanged

    if (needsGeocoding) {
      setIsGeocoding(true)
      try {
        const searchQuery = `${data.name}, ${data.country}`
        const coords = await geocodeAddress(searchQuery)
        if (coords) {
          latitude = coords.lat
          longitude = coords.lng
        }
      } catch (error) {
        console.error('Geocoding failed:', error)
      } finally {
        setIsGeocoding(false)
      }
    }

    const cleanedData: DestinationFormData = {
      ...data,
      notes: data.notes || undefined,
      latitude,
      longitude,
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
          placeholder="z.B. Barcelona"
          {...register('name', { required: 'Name ist erforderlich' })}
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Country */}
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          Land <span className="text-destructive">*</span>
        </label>
        <Input
          id="country"
          placeholder="z.B. Spanien"
          {...register('country', { required: 'Land ist erforderlich' })}
          className={cn(errors.country && 'border-destructive')}
        />
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      {/* Arrival / Departure */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="arrivalDate" className="text-sm font-medium">
            Ankunft
          </label>
          <Input
            id="arrivalDate"
            type="date"
            {...register('arrivalDate')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="departureDate" className="text-sm font-medium">
            Abreise
          </label>
          <Input
            id="departureDate"
            type="date"
            {...register('departureDate', {
              validate: (value) => {
                if (arrivalDate && value && value < arrivalDate) {
                  return 'Abreise muss nach der Ankunft liegen'
                }
                return true
              },
            })}
            className={cn(errors.departureDate && 'border-destructive')}
          />
          {errors.departureDate && (
            <p className="text-sm text-destructive">{errors.departureDate.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notizen
        </label>
        <textarea
          id="notes"
          placeholder="Zusätzliche Informationen..."
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
        <Button type="submit" disabled={isSubmitting || isGeocoding}>
          {isGeocoding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Suche Koordinaten...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              {isEditMode ? 'Speichern' : 'Reiseziel erstellen'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
