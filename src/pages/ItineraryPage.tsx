import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTripStore } from '@/stores';
import { DayPlanner } from '@/components/itinerary';
import { CalendarView } from '@/components/calendar';
import { ChevronLeft, Calendar, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'calendar';

export function ItineraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useTripStore((state) => state.getTrip(tripId || ''));

  if (!tripId || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Reise nicht gefunden
          </h2>
          <p className="text-muted-foreground mb-6">
            Die angeforderte Reise existiert nicht oder wurde gelöscht.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zu meinen Reisen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Link
              to={`/trip/${tripId}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück zur Reise
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Tagesplanung
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {trip.name}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'gap-2',
                  viewMode === 'list' && 'shadow-sm'
                )}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'gap-2',
                  viewMode === 'calendar' && 'shadow-sm'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Kalender</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          {viewMode === 'list' ? (
            <DayPlanner
              tripId={tripId}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />
          ) : (
            <CalendarView
              tripId={tripId}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />
          )}
        </div>
      </main>
    </div>
  );
}
