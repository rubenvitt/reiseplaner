'use client'

import { useForm } from 'react-hook-form'
import { Button, Input, Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Expense, ExpenseCategory, PaymentMethod } from '@/types'

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: 'accommodation', label: 'Unterkunft' },
  { value: 'transport', label: 'Transport' },
  { value: 'food', label: 'Essen' },
  { value: 'activities', label: 'Aktivitäten' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'insurance', label: 'Versicherung' },
  { value: 'visa', label: 'Visum' },
  { value: 'other', label: 'Sonstiges' },
]

const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'CHF'] as const

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Bargeld' },
  { value: 'credit_card', label: 'Kreditkarte' },
  { value: 'debit_card', label: 'Debitkarte' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Sonstige' },
]

export interface ExpenseFormData {
  tripId: string
  title: string
  amount: number
  currency: string
  category: ExpenseCategory
  date?: string
  paymentMethod?: PaymentMethod
  notes?: string
  isReimbursable: boolean
}

export interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: ExpenseFormData) => void
  onCancel: () => void
  tripId: string
  currency?: string
}

export function ExpenseForm({
  expense,
  onSubmit,
  onCancel,
  tripId,
  currency = 'EUR',
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      tripId,
      title: expense?.title ?? '',
      amount: expense?.amount ?? 0,
      currency: expense?.currency ?? currency,
      category: expense?.category ?? 'other',
      date: expense?.date ?? new Date().toISOString().split('T')[0],
      paymentMethod: expense?.paymentMethod,
      notes: expense?.notes ?? '',
      isReimbursable: expense?.isReimbursable ?? false,
    },
  })

  const isReimbursable = watch('isReimbursable')

  const handleFormSubmit = (data: ExpenseFormData) => {
    const cleanedData: ExpenseFormData = {
      ...data,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod || undefined,
      notes: data.notes || undefined,
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
          placeholder="z.B. Hotelübernachtung"
          {...register('title', { required: 'Titel ist erforderlich' })}
          className={cn(errors.title && 'border-destructive')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Betrag und Währung */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Betrag <span className="text-destructive">*</span>
          </label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register('amount', {
              required: 'Betrag ist erforderlich',
              min: { value: 0.01, message: 'Betrag muss größer als 0 sein' },
              valueAsNumber: true,
            })}
            className={cn(errors.amount && 'border-destructive')}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
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
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
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

      {/* Datum */}
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Datum
        </label>
        <Input
          id="date"
          type="date"
          {...register('date')}
        />
      </div>

      {/* Zahlungsmethode */}
      <div className="space-y-2">
        <label htmlFor="paymentMethod" className="text-sm font-medium">
          Zahlungsmethode
        </label>
        <select
          id="paymentMethod"
          {...register('paymentMethod')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Keine Angabe --</option>
          {PAYMENT_METHOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

      {/* Erstattungsfähig */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="isReimbursable"
          checked={isReimbursable}
          onCheckedChange={(checked) => setValue('isReimbursable', checked)}
        />
        <label htmlFor="isReimbursable" className="text-sm font-medium cursor-pointer">
          Erstattungsfähig
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {expense ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  )
}
