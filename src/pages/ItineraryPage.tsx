import { useParams, Link } from 'react-router-dom';
import { useTripStore } from '@/stores';
import { DayPlanner } from '@/components/itinerary';
import { ChevronLeft, Calendar } from 'lucide-react';

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useTripStore((state) => state.getTrip(tripId || ''));

  if (!tripId || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Reise nicht gefunden
          </h2>
          <p className="text-gray-500 mb-6">
            Die angeforderte Reise existiert nicht oder wurde geloescht.
          </p>
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurueck zu meinen Reisen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Link
              to={`/trips/${tripId}`}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurueck zur Reise
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Tagesplanung
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {trip.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - DayPlanner */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <DayPlanner
            tripId={tripId}
            startDate={trip.startDate}
            endDate={trip.endDate}
          />
        </div>
      </main>
    </div>
  );
}
