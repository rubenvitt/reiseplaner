import { useStatistics } from '@/hooks/useStatistics'
import { StatsOverview, ExpenseChart, CategoryPieChart } from '@/components/statistics'

const activityCategoryLabels: Record<string, string> = {
  sightseeing: 'Sightseeing',
  food: 'Essen',
  transport: 'Transport',
  activity: 'Aktivität',
  relaxation: 'Entspannung',
  shopping: 'Shopping',
  other: 'Sonstiges',
}

const accommodationTypeLabels: Record<string, string> = {
  hotel: 'Hotel',
  airbnb: 'Airbnb',
  hostel: 'Hostel',
  apartment: 'Apartment',
  camping: 'Camping',
  other: 'Sonstiges',
}

const transportModeLabels: Record<string, string> = {
  car: 'Auto',
  train: 'Zug',
  flight: 'Flug',
  bus: 'Bus',
  ferry: 'Fähre',
  taxi: 'Taxi',
  walking: 'Zu Fuß',
  bicycle: 'Fahrrad',
  other: 'Sonstiges',
}

export function StatisticsPage() {
  const statistics = useStatistics()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Statistiken</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht über alle deine Reisen und Ausgaben
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8">
        <StatsOverview statistics={statistics} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <ExpenseChart data={statistics.budget.byCategory} />

        {/* Activities by Category */}
        <CategoryPieChart
          title="Aktivitäten nach Kategorie"
          data={statistics.activities.byCategory}
          labels={activityCategoryLabels}
        />

        {/* Accommodations by Type */}
        <CategoryPieChart
          title="Unterkünfte nach Typ"
          data={statistics.accommodations.byType}
          labels={accommodationTypeLabels}
        />

        {/* Transports by Mode */}
        <CategoryPieChart
          title="Transporte nach Art"
          data={statistics.transports.byMode}
          labels={transportModeLabels}
        />
      </div>

      {/* Countries List */}
      {statistics.trips.uniqueCountries.length > 0 && (
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Besuchte Länder</h3>
          <div className="flex flex-wrap gap-2">
            {statistics.trips.uniqueCountries.map((country) => (
              <span
                key={country}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Destinations List */}
      {statistics.trips.uniqueDestinations.length > 0 && (
        <div className="mt-6 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Besuchte Ziele</h3>
          <div className="flex flex-wrap gap-2">
            {statistics.trips.uniqueDestinations.map((destination) => (
              <span
                key={destination}
                className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {destination}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
