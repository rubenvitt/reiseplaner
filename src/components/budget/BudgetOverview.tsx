'use client'

import { useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useBudgetStore } from '@/stores'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseCategory } from '@/types'

interface BudgetOverviewProps {
  tripId: string
  totalBudget: number
  currency: string
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  accommodation: 'Unterkunft',
  transport: 'Transport',
  food: 'Essen',
  activities: 'Aktivitaeten',
  shopping: 'Shopping',
  insurance: 'Versicherung',
  visa: 'Visum',
  other: 'Sonstiges',
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  accommodation: 'bg-blue-500',
  transport: 'bg-cyan-500',
  food: 'bg-orange-500',
  activities: 'bg-green-500',
  shopping: 'bg-pink-500',
  insurance: 'bg-purple-500',
  visa: 'bg-yellow-500',
  other: 'bg-gray-500',
}

const ALL_CATEGORIES: ExpenseCategory[] = [
  'accommodation',
  'transport',
  'food',
  'activities',
  'shopping',
  'insurance',
  'visa',
  'other',
]

function getProgressColor(percentage: number): string {
  if (percentage < 50) return 'bg-green-500'
  if (percentage <= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function BudgetOverview({ tripId, totalBudget, currency }: BudgetOverviewProps) {
  const { getTotalSpent, getTotalSpentByCategory } = useBudgetStore()

  const totalSpent = getTotalSpent(tripId)
  const remaining = totalBudget - totalSpent
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const categoryBreakdown = useMemo(() => {
    return ALL_CATEGORIES.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      color: CATEGORY_COLORS[category],
      amount: getTotalSpentByCategory(tripId, category),
    })).filter((item) => item.amount > 0)
  }, [tripId, getTotalSpentByCategory])

  const isWarning = percentageUsed >= 80 && percentageUsed < 100
  const isOverBudget = percentageUsed >= 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Budget-Uebersicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Budget Overview */}
        <div className="space-y-4">
          {/* Budget Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gesamtbudget</p>
              <p className="text-lg font-semibold">
                {formatCurrency(totalBudget, currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Ausgegeben
              </p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(totalSpent, currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Verbleibend
              </p>
              <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(remaining, currency)}
              </p>
            </div>
          </div>

          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{percentageUsed.toFixed(1)}% verbraucht</span>
              <span>{formatCurrency(totalSpent, currency)} / {formatCurrency(totalBudget, currency)}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(percentageUsed)}`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>

          {/* Warning Messages */}
          {isWarning && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Achtung: Du hast bereits {percentageUsed.toFixed(1)}% deines Budgets ausgegeben.
              </p>
            </div>
          )}
          {isOverBudget && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-900/20 dark:text-red-200">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Budget ueberschritten! Du hast {formatCurrency(Math.abs(remaining), currency)} mehr ausgegeben als geplant.
              </p>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Aufschluesselung nach Kategorie
            </h4>
            <div className="space-y-3">
              {categoryBreakdown.map(({ category, label, color, amount }) => {
                const categoryPercentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="font-medium">{formatCurrency(amount, currency)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${color}`}
                        style={{ width: `${categoryPercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {categoryBreakdown.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Noch keine Ausgaben erfasst.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
