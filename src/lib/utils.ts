import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateOrPlaceholder(
  date: string | undefined,
  placeholder = 'Datum noch offen'
): string {
  if (!date) return placeholder
  return formatDate(date)
}

export function formatDateRangeOrPlaceholder(
  startDate: string | undefined,
  endDate: string | undefined,
  placeholder = 'Zeitraum noch offen'
): string {
  if (!startDate && !endDate) return placeholder
  const start = startDate ? formatDate(startDate) : 'offen'
  const end = endDate ? formatDate(endDate) : 'offen'
  return `${start} - ${end}`
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}
