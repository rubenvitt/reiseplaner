import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { useTripStore } from '@/stores';

interface Tab {
  id: string;
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Übersicht', path: '' },
  { id: 'tasks', label: 'Aufgaben', path: 'tasks' },
  { id: 'itinerary', label: 'Tagesplan', path: 'itinerary' },
  { id: 'map', label: 'Karte', path: 'map' },
  { id: 'transport', label: 'Transport', path: 'transport' },
  { id: 'accommodations', label: 'Unterkünfte', path: 'accommodations' },
  { id: 'documents', label: 'Dokumente', path: 'documents' },
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
        <div className="bg-card rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Reise nicht gefunden
          </h1>
          <p className="text-muted-foreground mb-6">
            Die angeforderte Reise existiert nicht oder wurde gelöscht.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Zurück zur Übersicht
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
          className="text-primary hover:underline text-sm"
        >
          &larr; Zurück zur Übersicht
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-6">
        {trip.name}
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const tabPath = tab.path ? `/trip/${tripId}/${tab.path}` : `/trip/${tripId}`;
            const isActive = activeTabId === tab.id;

            return (
              <Link
                key={tab.id}
                to={tabPath}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
