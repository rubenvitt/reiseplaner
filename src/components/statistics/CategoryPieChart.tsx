interface CategoryPieChartProps {
  title: string
  data: Record<string, number>
  labels?: Record<string, string>
}

const defaultColors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f97316', // orange
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#ef4444', // red
  '#eab308', // yellow
  '#64748b', // slate
]

export function CategoryPieChart({ title, data, labels }: CategoryPieChartProps) {
  const entries = Object.entries(data).filter(([, value]) => value > 0)
  const total = entries.reduce((acc, [, value]) => acc + value, 0)

  if (entries.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <p className="text-muted-foreground text-center py-8">Keine Daten vorhanden</p>
      </div>
    )
  }

  // Sort by value descending
  const sortedEntries = entries.sort((a, b) => b[1] - a[1])

  // Calculate percentages and create gradient stops
  let currentAngle = 0
  const segments = sortedEntries.map(([key, value], index) => {
    const percentage = (value / total) * 100
    const startAngle = currentAngle
    currentAngle += percentage * 3.6 // 360deg / 100%
    return {
      key,
      value,
      percentage,
      startAngle,
      endAngle: currentAngle,
      color: defaultColors[index % defaultColors.length],
    }
  })

  // Create conic gradient
  const gradientStops = segments
    .map((segment) => `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`)
    .join(', ')

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <div
            className="w-40 h-40 rounded-full"
            style={{
              background: `conic-gradient(${gradientStops})`,
            }}
          >
            {/* Center hole for donut effect */}
            <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{total}</div>
                <div className="text-xs text-muted-foreground">Gesamt</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment) => (
            <div key={segment.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-foreground">
                  {labels?.[segment.key] || segment.key}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{segment.value}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
