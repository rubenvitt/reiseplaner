import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { useTripStore } from '@/stores';

interface Tab {
  id: string;
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Ubersicht', path: '' },
  { id: 'itinerary', label: 'Tagesplan', path: 'itinerary' },
  { id: 'accommodations', label: 'Unterkunfte', path: 'accommodations' },
  { id: 'budget', label: 'Budget', path: 'budget' },
  { id: 'packing', label: 'Packliste', path: 'packing' },
];

export function TripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const trip = useTripStore((state) => state.getTrip(tripId || ''));

  if (!tripId || !trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Reise nicht gefunden
          </h1>
          <p className="text-gray-500 mb-6">
            Die angeforderte Reise existiert nicht oder wurde geloscht.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zuruck zur Ubersicht
          </Link>
        </div>
      </div>
    );
  }

  // Determine active tab based on current path
  const currentPath = location.pathname;
  const basePath = `/trip/${tripId}`;
  const activeTabId = tabs.find((tab) => {
    const tabPath = tab.path ? `${basePath}/${tab.path}` : basePath;
    return currentPath === tabPath;
  })?.id || 'overview';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm"
        >
          &larr; Zuruck zur Ubersicht
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {trip.name}
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const tabPath = tab.path ? `/trip/${tripId}/${tab.path}` : `/trip/${tripId}`;
            const isActive = activeTabId === tab.id;

            return (
              <Link
                key={tab.id}
                to={tabPath}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tab Content via Outlet */}
      <Outlet />
    </div>
  );
}
