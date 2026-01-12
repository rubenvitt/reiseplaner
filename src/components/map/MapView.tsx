import { useState, useCallback, useEffect } from 'react'
import Map, { NavigationControl, FullscreenControl, ScaleControl, type ViewState } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getMapboxToken } from '@/lib/geocoding'
import { useThemeStore } from '@/stores/themeStore'
import { MapMarker } from './MapMarker'
import type { MapLocation } from '@/hooks/useMapLocations'

interface MapViewProps {
  locations: MapLocation[]
  bounds?: {
    sw: { latitude: number; longitude: number }
    ne: { latitude: number; longitude: number }
  } | null
  onLocationClick?: (location: MapLocation) => void
  className?: string
}

const DEFAULT_VIEW: Partial<ViewState> = {
  latitude: 51.1657,
  longitude: 10.4515,
  zoom: 5,
}

export function MapView({ locations, bounds, onLocationClick, className = '' }: MapViewProps) {
  const mapboxToken = getMapboxToken()
  const theme = useThemeStore((state) => state.theme)
  const [viewState, setViewState] = useState<Partial<ViewState>>(DEFAULT_VIEW)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)

  // Determine map style based on theme
  const mapStyle = theme === 'dark'
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/streets-v12'

  // Fit bounds when locations change
  useEffect(() => {
    if (bounds && locations.length > 0) {
      const { sw, ne } = bounds
      const centerLat = (sw.latitude + ne.latitude) / 2
      const centerLng = (sw.longitude + ne.longitude) / 2

      // Calculate appropriate zoom level based on bounds
      const latDiff = Math.abs(ne.latitude - sw.latitude)
      const lngDiff = Math.abs(ne.longitude - sw.longitude)
      const maxDiff = Math.max(latDiff, lngDiff)

      let zoom = 10
      if (maxDiff > 20) zoom = 3
      else if (maxDiff > 10) zoom = 4
      else if (maxDiff > 5) zoom = 5
      else if (maxDiff > 2) zoom = 6
      else if (maxDiff > 1) zoom = 7
      else if (maxDiff > 0.5) zoom = 8
      else if (maxDiff > 0.1) zoom = 10
      else zoom = 12

      setViewState({
        latitude: centerLat,
        longitude: centerLng,
        zoom,
      })
    }
  }, [bounds, locations.length])

  const handleMarkerClick = useCallback((location: MapLocation) => {
    setSelectedLocation(location)
    onLocationClick?.(location)

    if (location.coordinates) {
      setViewState((prev: Partial<ViewState>) => ({
        ...prev,
        latitude: location.coordinates!.latitude,
        longitude: location.coordinates!.longitude,
        zoom: Math.max(prev.zoom || 10, 12),
      }))
    }
  }, [onLocationClick])

  if (!mapboxToken) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Mapbox Token fehlt
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Um die Karte anzuzeigen, erstelle eine <code className="bg-muted px-1 rounded">.env</code> Datei
            mit <code className="bg-muted px-1 rounded">VITE_MAPBOX_TOKEN=dein_token</code>
          </p>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-primary hover:underline text-sm"
          >
            Mapbox Token erstellen &rarr;
          </a>
        </div>
      </div>
    )
  }

  const locationsWithCoords = locations.filter((loc) => loc.coordinates)

  if (locationsWithCoords.length === 0) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keine Orte gefunden
          </h3>
          <p className="text-muted-foreground text-sm">
            Füge Unterkünfte, Aktivitäten oder Transportverbindungen hinzu, um sie auf der Karte zu sehen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" />

        {locationsWithCoords.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            isSelected={selectedLocation?.id === location.id}
            onClick={() => handleMarkerClick(location)}
          />
        ))}
      </Map>
    </div>
  )
}
