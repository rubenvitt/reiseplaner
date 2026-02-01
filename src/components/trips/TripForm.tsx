import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/ui'
import type { Trip, TripStatus } from '@/types'

const CURRENCIES = [
  { value: 'EUR', label: 'EUR (Euro)' },
  { value: 'USD', label: 'USD (US Dollar)' },
  { value: 'GBP', label: 'GBP (British Pound)' },
  { value: 'CHF', label: 'CHF (Swiss Franc)' },
] as const

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planung' },
  { value: 'upcoming', label: 'Bevorstehend' },
  { value: 'ongoing', label: 'Aktiv' },
  { value: 'completed', label: 'Abgeschlossen' },
] as const

export interface TripFormData {
  name: string
  description?: string
  startDate?: string
  endDate?: string
  currency: string
  totalBudget: number
  status?: TripStatus
}

interface TripFormProps {
  trip?: Trip
  onSubmit: (data: TripFormData) => void
  onCancel: () => void
}

export function TripForm({ trip, onSubmit, onCancel }: TripFormProps) {
  const isEditMode = Boolean(trip)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    defaultValues: {
      name: trip?.name ?? '',
      description: trip?.description ?? '',
      startDate: trip?.startDate ?? '',
      endDate: trip?.endDate ?? '',
      currency: trip?.currency ?? 'EUR',
      totalBudget: trip?.totalBudget ?? 0,
      status: trip?.status ?? 'planning',
    },
  })

  const startDate = watch('startDate')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          placeholder="z.B. Sommerurlaub Italien"
          {...register('name', {
            required: 'Name ist erforderlich',
          })}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Beschreibung
        </label>
        <textarea
          id="description"
          placeholder="Beschreibe deine Reise..."
          className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register('description')}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Startdatum
          </label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            Enddatum
          </label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate', {
              validate: (value) => {
                if (startDate && value && value < startDate) {
                  return 'Enddatum muss nach dem Startdatum liegen'
                }
                return true
              },
            })}
            aria-invalid={errors.endDate ? 'true' : 'false'}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Currency and Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium">
            Währung
          </label>
          <select
            id="currency"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('currency')}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="totalBudget" className="text-sm font-medium">
            Budget
          </label>
          <Input
            id="totalBudget"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register('totalBudget', {
              valueAsNumber: true,
              min: { value: 0, message: 'Budget muss positiv sein' },
            })}
            aria-invalid={errors.totalBudget ? 'true' : 'false'}
          />
          {errors.totalBudget && (
            <p className="text-sm text-destructive">
              {errors.totalBudget.message}
            </p>
          )}
        </div>
      </div>

      {/* Status (only in edit mode) */}
      {isEditMode && (
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('status')}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? 'Speichern' : 'Reise erstellen'}
        </Button>
      </div>
    </form>
  )
}
