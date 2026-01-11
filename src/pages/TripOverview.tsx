import { useParams } from 'react-router-dom';
import { useTripStore } from '@/stores';

export function TripOverview() {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useTripStore((state) => state.getTrip(tripId || ''));

  if (!trip) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Trip Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reiseubersicht</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Reisezeitraum</p>
            <p className="text-gray-900">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </div>

          {trip.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Beschreibung</p>
              <p className="text-gray-900">{trip.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Destinations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reiseziele</h2>

        {trip.destinations.length === 0 ? (
          <p className="text-gray-500">
            Noch keine Reiseziele hinzugefugt.
          </p>
        ) : (
          <div className="space-y-3">
            {trip.destinations
              .sort((a, b) => a.order - b.order)
              .map((destination, index) => (
                <div
                  key={destination.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{destination.name}</p>
                    {destination.country && (
                      <p className="text-sm text-gray-500">{destination.country}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {formatDate(destination.arrivalDate)} - {formatDate(destination.departureDate)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
