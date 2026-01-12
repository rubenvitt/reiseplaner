import { useParams, Link } from 'react-router-dom'
import { useTripStore } from '@/stores'
import { PackingList } from '@/components/packing'

export function PackingPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const getTrip = useTripStore((state) => state.getTrip)

  const trip = tripId ? getTrip(tripId) : undefined

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p>Reise nicht gefunden.</p>
          <Link to="/" className="text-primary hover:underline">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to={`/trip/${tripId}`}
          className="text-primary hover:underline text-sm"
        >
          ← Zurück zur Reise
        </Link>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Packliste - {trip.name}
        </h1>
      </div>

      {/* Packing List Component */}
      <div className="mt-6">
        <PackingList tripId={tripId!} />
      </div>
    </div>
  )
}
