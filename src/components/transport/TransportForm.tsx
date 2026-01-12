'use client'

import { useForm, Controller } from 'react-hook-form'
import {
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Footprints,
  Bike,
  CircleDot,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Input, Checkbox } from '@/components/ui'
import type { Transport, TransportMode, Destination } from '@/types'
import { cn } from '@/lib/utils'

const TRANSPORT_MODES: { value: TransportMode; label: string; icon: LucideIcon }[] = [
  { value: 'car', label: 'Auto', icon: Car },
  { value: 'train', label: 'Zug', icon: Train },
  { value: 'flight', label: 'Flug', icon: Plane },
  { value: 'bus', label: 'Bus', icon: Bus },
  { value: 'ferry', label: 'Fähre', icon: Ship },
  { value: 'taxi', label: 'Taxi/Uber', icon: Car },
  { value: 'walking', label: 'Zu Fuß', icon: Footprints },
  { value: 'bicycle', label: 'Fahrrad', icon: Bike },
  { value: 'other', label: 'Sonstiges', icon: CircleDot },
]

const CURRENCIES = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CHF', label: 'CHF' },
] as const

export interface TransportFormData {
  mode: TransportMode
  originName: string
  originDestinationId?: string
  destinationName: string
  destinationDestinationId?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  bookingReference?: string
  price?: number
  currency: string
  isPaid: boolean
  // Flight details
  flightNumber?: string
  airline?: string
  terminal?: string
  gate?: string
  // Train details
  trainNumber?: string
  carrier?: string
  wagon?: string
  seat?: string
  platform?: string
  // Car details
  vehicleInfo?: string
  licensePlate?: string
  // Notes
  notes?: string
}

export interface TransportFormProps {
  transport?: Transport
  destinations?: Destination[]
  onSubmit: (data: TransportFormData) => void
  onCancel: () => void
  tripId: string
}

export function TransportForm({
  transport,
  destinations = [],
  onSubmit,
  onCancel,
}: TransportFormProps) {
  const isEditMode = Boolean(transport)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransportFormData>({
    defaultValues: {
      mode: transport?.mode ?? 'car',
      originName: transport?.origin.name ?? '',
      originDestinationId: transport?.origin.destinationId ?? '',
      destinationName: transport?.destination.name ?? '',
      destinationDestinationId: transport?.destination.destinationId ?? '',
      departureDate: transport?.departureDate ?? '',
      departureTime: transport?.departureTime ?? '',
      arrivalDate: transport?.arrivalDate ?? '',
      arrivalTime: transport?.arrivalTime ?? '',
      bookingReference: transport?.bookingReference ?? '',
      price: transport?.price ?? undefined,
      currency: transport?.currency ?? 'EUR',
      isPaid: transport?.isPaid ?? false,
      flightNumber: transport?.details?.flightNumber ?? '',
      airline: transport?.details?.airline ?? '',
      terminal: transport?.details?.terminal ?? '',
      gate: transport?.details?.gate ?? '',
      trainNumber: transport?.details?.trainNumber ?? '',
      carrier: transport?.details?.carrier ?? '',
      wagon: transport?.details?.wagon ?? '',
      seat: transport?.details?.seat ?? '',
      platform: transport?.details?.platform ?? '',
      vehicleInfo: transport?.details?.vehicleInfo ?? '',
      licensePlate: transport?.details?.licensePlate ?? '',
      notes: transport?.notes ?? '',
    },
  })

  const mode = watch('mode')
  const departureDate = watch('departureDate')
  const originDestinationId = watch('originDestinationId')
  const destinationDestinationId = watch('destinationDestinationId')

  const handleFormSubmit = (data: TransportFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Transport Mode */}
      <div className="space-y-2">
        <label htmlFor="mode" className="text-sm font-medium">
          Transportmittel <span className="text-destructive">*</span>
        </label>
        <select
          id="mode"
          {...register('mode')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {TRANSPORT_MODES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Abfahrtsort <span className="text-destructive">*</span>
        </label>
        {destinations.length > 0 && (
          <select
            {...register('originDestinationId')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mb-2"
          >
            <option value="">Anderer Ort eingeben...</option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
        )}
        {!originDestinationId && (
          <Input
            placeholder="z.B. Frankfurt Hauptbahnhof"
            {...register('originName', {
              required: !originDestinationId ? 'Abfahrtsort ist erforderlich' : false,
            })}
            className={cn(errors.originName && 'border-destructive')}
          />
        )}
        {errors.originName && (
          <p className="text-sm text-destructive">{errors.originName.message}</p>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Zielort <span className="text-destructive">*</span>
        </label>
        {destinations.length > 0 && (
          <select
            {...register('destinationDestinationId')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mb-2"
          >
            <option value="">Anderer Ort eingeben...</option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
        )}
        {!destinationDestinationId && (
          <Input
            placeholder="z.B. München Hauptbahnhof"
            {...register('destinationName', {
              required: !destinationDestinationId ? 'Zielort ist erforderlich' : false,
            })}
            className={cn(errors.destinationName && 'border-destructive')}
          />
        )}
        {errors.destinationName && (
          <p className="text-sm text-destructive">{errors.destinationName.message}</p>
        )}
      </div>

      {/* Departure Date/Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="departureDate" className="text-sm font-medium">
            Abfahrtsdatum
          </label>
          <Input
            id="departureDate"
            type="date"
            {...register('departureDate')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="departureTime" className="text-sm font-medium">
            Abfahrtszeit
          </label>
          <Input
            id="departureTime"
            type="time"
            {...register('departureTime')}
          />
        </div>
      </div>

      {/* Arrival Date/Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="arrivalDate" className="text-sm font-medium">
            Ankunftsdatum
          </label>
          <Input
            id="arrivalDate"
            type="date"
            {...register('arrivalDate', {
              validate: (value) => {
                if (departureDate && value && value < departureDate) {
                  return 'Ankunft muss nach Abfahrt liegen'
                }
                return true
              },
            })}
            className={cn(errors.arrivalDate && 'border-destructive')}
          />
          {errors.arrivalDate && (
            <p className="text-sm text-destructive">{errors.arrivalDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="arrivalTime" className="text-sm font-medium">
            Ankunftszeit
          </label>
          <Input
            id="arrivalTime"
            type="time"
            {...register('arrivalTime')}
          />
        </div>
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Preis
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register('price', {
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
            Währung
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

      {/* Booking Reference */}
      <div className="space-y-2">
        <label htmlFor="bookingReference" className="text-sm font-medium">
          Buchungsnummer
        </label>
        <Input
          id="bookingReference"
          placeholder="Buchungsnummer oder Referenz"
          {...register('bookingReference')}
        />
      </div>

      {/* Flight-specific Details */}
      {mode === 'flight' && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground">Flugdetails</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="flightNumber" className="text-sm font-medium">
                Flugnummer
              </label>
              <Input
                id="flightNumber"
                placeholder="z.B. LH 123"
                {...register('flightNumber')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="airline" className="text-sm font-medium">
                Airline
              </label>
              <Input
                id="airline"
                placeholder="z.B. Lufthansa"
                {...register('airline')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="terminal" className="text-sm font-medium">
                Terminal
              </label>
              <Input
                id="terminal"
                placeholder="z.B. Terminal 1"
                {...register('terminal')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gate" className="text-sm font-medium">
                Gate
              </label>
              <Input
                id="gate"
                placeholder="z.B. A12"
                {...register('gate')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Train-specific Details */}
      {mode === 'train' && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground">Zugdetails</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="trainNumber" className="text-sm font-medium">
                Zugnummer
              </label>
              <Input
                id="trainNumber"
                placeholder="z.B. ICE 123"
                {...register('trainNumber')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="carrier" className="text-sm font-medium">
                Anbieter
              </label>
              <Input
                id="carrier"
                placeholder="z.B. Deutsche Bahn"
                {...register('carrier')}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">
                Gleis
              </label>
              <Input
                id="platform"
                placeholder="z.B. 12"
                {...register('platform')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="wagon" className="text-sm font-medium">
                Wagen
              </label>
              <Input
                id="wagon"
                placeholder="z.B. 7"
                {...register('wagon')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="seat" className="text-sm font-medium">
                Sitzplatz
              </label>
              <Input
                id="seat"
                placeholder="z.B. 42"
                {...register('seat')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Car-specific Details */}
      {mode === 'car' && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground">Fahrzeugdetails</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="vehicleInfo" className="text-sm font-medium">
                Fahrzeug
              </label>
              <Input
                id="vehicleInfo"
                placeholder="z.B. VW Golf"
                {...register('vehicleInfo')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="licensePlate" className="text-sm font-medium">
                Kennzeichen
              </label>
              <Input
                id="licensePlate"
                placeholder="z.B. M-AB 1234"
                {...register('licensePlate')}
              />
            </div>
          </div>
        </div>
      )}

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
          {isEditMode ? 'Speichern' : 'Transport erstellen'}
        </Button>
      </div>
    </form>
  )
}
