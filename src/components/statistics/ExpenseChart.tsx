import type { ExpenseCategory } from '@/types'

interface ExpenseChartProps {
  data: Record<ExpenseCategory, number>
  currency?: string
}

const categoryLabels: Record<ExpenseCategory, string> = {
  accommodation: 'Unterkunft',
  transport: 'Transport',
  food: 'Essen',
  activities: 'Aktivitäten',
  shopping: 'Shopping',
  insurance: 'Versicherung',
  visa: 'Visum',
  other: 'Sonstiges',
}

const categoryColors: Record<ExpenseCategory, string> = {
  accommodation: 'bg-blue-500',
  transport: 'bg-green-500',
  food: 'bg-orange-500',
  activities: 'bg-purple-500',
  shopping: 'bg-pink-500',
  insurance: 'bg-teal-500',
  visa: 'bg-indigo-500',
  other: 'bg-gray-500',
}

export function ExpenseChart({ data, currency = 'EUR' }: ExpenseChartProps) {
  const categories = Object.keys(data) as ExpenseCategory[]
  const maxValue = Math.max(...Object.values(data), 1)
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount)

  // Sort by value descending
  const sortedCategories = categories
    .filter((cat) => data[cat] > 0)
    .sort((a, b) => data[b] - data[a])

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ausgaben nach Kategorie</h3>
        <p className="text-muted-foreground text-center py-8">Keine Ausgaben vorhanden</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Ausgaben nach Kategorie</h3>
        <span className="text-sm text-muted-foreground">Gesamt: {formatCurrency(total)}</span>
      </div>

      <div className="space-y-4">
        {sortedCategories.map((category) => {
          const value = data[category]
          const percentage = (value / maxValue) * 100
          const percentageOfTotal = (value / total) * 100

          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{categoryLabels[category]}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{percentageOfTotal.toFixed(1)}%</span>
                  <span className="text-foreground font-medium w-24 text-right">
                    {formatCurrency(value)}
                  </span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${categoryColors[category]} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-3">
          {sortedCategories.map((category) => (
            <div key={category} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category]}`} />
              <span className="text-xs text-muted-foreground">{categoryLabels[category]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
