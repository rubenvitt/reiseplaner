'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button, Input, Checkbox } from '@/components/ui'
import type { Accommodation, AccommodationType } from '@/types'
import { cn } from '@/lib/utils'

const ACCOMMODATION_TYPES: { value: AccommodationType; label: string }[] = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'camping', label: 'Camping' },
  { value: 'other', label: 'Sonstige' },
]

const CURRENCIES = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CHF', label: 'CHF' },
] as const

export interface AccommodationFormData {
  name: string
  type: AccommodationType
  address: string
  checkIn: string
  checkOut: string
  price: number
  currency: string
  confirmationNumber?: string
  phone?: string
  email?: string
  website?: string
  notes?: string
  isPaid: boolean
}

export interface AccommodationFormProps {
  accommodation?: Accommodation
  onSubmit: (data: AccommodationFormData) => void
  onCancel: () => void
  tripId: string
}

export function AccommodationForm({
  accommodation,
  onSubmit,
  onCancel,
}: AccommodationFormProps) {
  const isEditMode = Boolean(accommodation)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AccommodationFormData>({
    defaultValues: {
      name: accommodation?.name ?? '',
      type: accommodation?.type ?? 'hotel',
      address: accommodation?.address ?? '',
      checkIn: accommodation?.checkIn ?? '',
      checkOut: accommodation?.checkOut ?? '',
      price: accommodation?.price ?? 0,
      currency: accommodation?.currency ?? 'EUR',
      confirmationNumber: accommodation?.confirmationNumber ?? '',
      phone: accommodation?.contactInfo?.phone ?? '',
      email: accommodation?.contactInfo?.email ?? '',
      website: accommodation?.contactInfo?.website ?? '',
      notes: accommodation?.notes ?? '',
      isPaid: accommodation?.isPaid ?? false,
    },
  })

  const checkIn = watch('checkIn')

  const handleFormSubmit = (data: AccommodationFormData) => {
    const cleanedData: AccommodationFormData = {
      ...data,
      confirmationNumber: data.confirmationNumber || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
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
          placeholder="z.B. Hotel Alpenblick"
          {...register('name', { required: 'Name ist erforderlich' })}
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Unterkunftsart
        </label>
        <select
          id="type"
          {...register('type')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ACCOMMODATION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Adresse <span className="text-destructive">*</span>
        </label>
        <Input
          id="address"
          placeholder="Strasse, PLZ Ort, Land"
          {...register('address', { required: 'Adresse ist erforderlich' })}
          className={cn(errors.address && 'border-destructive')}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="checkIn" className="text-sm font-medium">
            Check-in <span className="text-destructive">*</span>
          </label>
          <Input
            id="checkIn"
            type="date"
            {...register('checkIn', { required: 'Check-in Datum ist erforderlich' })}
            className={cn(errors.checkIn && 'border-destructive')}
          />
          {errors.checkIn && (
            <p className="text-sm text-destructive">{errors.checkIn.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="checkOut" className="text-sm font-medium">
            Check-out <span className="text-destructive">*</span>
          </label>
          <Input
            id="checkOut"
            type="date"
            {...register('checkOut', {
              required: 'Check-out Datum ist erforderlich',
              validate: (value) => {
                if (checkIn && value < checkIn) {
                  return 'Check-out muss nach dem Check-in liegen'
                }
                return true
              },
            })}
            className={cn(errors.checkOut && 'border-destructive')}
          />
          {errors.checkOut && (
            <p className="text-sm text-destructive">{errors.checkOut.message}</p>
          )}
        </div>
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Preis <span className="text-destructive">*</span>
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register('price', {
              required: 'Preis ist erforderlich',
              valueAsNumber: true,
              min: { value: 0, message: 'Preis muss positiv sein' },
            })}
            className={cn(errors.price && 'border-destructive')}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium">
            Waehrung
          </label>
          <select
            id="currency"
            {...register('currency')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation Number */}
      <div className="space-y-2">
        <label htmlFor="confirmationNumber" className="text-sm font-medium">
          Buchungsnummer
        </label>
        <Input
          id="confirmationNumber"
          placeholder="Buchungsnummer oder Referenz"
          {...register('confirmationNumber')}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Kontaktdaten</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefon
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+49 123 456789"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-Mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="hotel@beispiel.de"
              {...register('email')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <Input
            id="website"
            type="url"
            placeholder="https://www.beispiel.de"
            {...register('website')}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notizen
        </label>
        <textarea
          id="notes"
          placeholder="Zusaetzliche Informationen..."
          rows={3}
          {...register('notes')}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Is Paid */}
      <div className="flex items-center gap-2">
        <Controller
          name="isPaid"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isPaid"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label htmlFor="isPaid" className="text-sm font-medium cursor-pointer">
          Bereits bezahlt
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? 'Speichern' : 'Unterkunft erstellen'}
        </Button>
      </div>
    </form>
  )
}
