'use client'

import {
  Calendar,
  CreditCard,
  Pencil,
  Trash2,
  StickyNote,
  RefreshCw,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Expense, ExpenseCategory, PaymentMethod } from '@/types'

export interface ExpenseCardProps {
  expense: Expense
  currency?: string
  onEdit?: () => void
  onDelete?: () => void
}

const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { label: string; className: string }
> = {
  accommodation: {
    label: 'Unterkunft',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  },
  transport: {
    label: 'Transport',
    className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  },
  food: {
    label: 'Essen',
    className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  },
  activities: {
    label: 'Aktivitäten',
    className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  },
  shopping: {
    label: 'Shopping',
    className: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
  },
  insurance: {
    label: 'Versicherung',
    className: 'bg-muted text-muted-foreground border-border',
  },
  visa: {
    label: 'Visum',
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  },
  other: {
    label: 'Sonstiges',
    className: 'bg-secondary text-secondary-foreground border-border',
  },
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Bargeld',
  credit_card: 'Kreditkarte',
  debit_card: 'Debitkarte',
  paypal: 'PayPal',
  other: 'Sonstige',
}

export function ExpenseCard({ expense, currency, onEdit, onDelete }: ExpenseCardProps) {
  const categoryConfig = CATEGORY_CONFIG[expense.category]
  const hasActions = onEdit || onDelete
  const displayCurrency = currency ?? expense.currency

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg">{expense.title}</CardTitle>
          <div className="flex items-center gap-2">
            {expense.isReimbursable && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                <RefreshCw className="mr-1 h-3 w-3" />
                Erstattbar
              </Badge>
            )}
            <Badge className={categoryConfig.className}>
              {categoryConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Betrag */}
        <div className="text-2xl font-bold text-primary">
          {formatCurrency(expense.amount, displayCurrency)}
        </div>

        {/* Datum */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(expense.date)}</span>
        </div>

        {/* Zahlungsmethode */}
        {expense.paymentMethod && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</span>
          </div>
        )}

        {/* Notizen */}
        {expense.notes && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <StickyNote className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{expense.notes}</span>
          </div>
        )}

        {/* Aktionen */}
        {hasActions && (
          <div className="flex items-center gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
