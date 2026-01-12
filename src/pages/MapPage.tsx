import { useParams } from 'react-router-dom'
import { MapView } from '@/components/map'
import { useMapLocations } from '@/hooks/useMapLocations'
import { getMapboxToken } from '@/lib/geocoding'

export function MapPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const hasToken = Boolean(getMapboxToken())

  const { locations, locationsWithCoordinates, bounds, isGeocoding } = useMapLocations({
    tripId: tripId || '',
    autoGeocode: hasToken,
  })

  if (!tripId) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Keine Reise ausgewählt
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Karte</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Alle Orte deiner Reise auf einen Blick
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {locations.filter((l) => l.type === 'destination').length}
          </div>
          <div className="text-sm text-muted-foreground">Reiseziele</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {locations.filter((l) => l.type === 'accommodation').length}
          </div>
          <div className="text-sm text-muted-foreground">Unterkünfte</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {locations.filter((l) => l.type === 'activity').length}
          </div>
          <div className="text-sm text-muted-foreground">Aktivitäten</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {locations.filter((l) => l.type.startsWith('transport')).length}
          </div>
          <div className="text-sm text-muted-foreground">Transportorte</div>
        </div>
      </div>

      {/* Loading indicator */}
      {isGeocoding && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          <span className="text-sm text-primary">Orte werden geladen...</span>
        </div>
      )}

      {/* Map */}
      <MapView
        locations={locationsWithCoordinates}
        bounds={bounds}
        className="h-[600px]"
      />

      {/* Legend */}
      <div className="mt-6 bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Legende</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Reiseziel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Unterkunft</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Abfahrt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Ankunft</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">Aktivität</span>
          </div>
        </div>
      </div>

      {/* Info */}
      {locations.length > 0 && locationsWithCoordinates.length === 0 && !isGeocoding && (
        <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Es wurden {locations.length} Orte gefunden, aber keine Koordinaten ermittelt.
            Stelle sicher, dass ein gültiger Mapbox Token in der <code className="bg-muted px-1 rounded">.env</code> Datei konfiguriert ist.
          </p>
        </div>
      )}
    </div>
  )
}
