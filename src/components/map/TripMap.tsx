import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DestinationMarker } from './DestinationMarker'
import { ActivityMarker } from './ActivityMarker'
import { AccommodationMarker } from './AccommodationMarker'
import { RoutePolyline } from './RoutePolyline'
import { MapControls } from './MapControls'
import type { Destination, Activity, Accommodation } from '@/types'

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// Layer URLs
type LayerType = 'standard' | 'satellite' | 'terrain'

const tileLayers: Record<LayerType, { url: string; attribution: string }> = {
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
}

// Default center: Germany
const DEFAULT_CENTER: [number, number] = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6

interface TripMapProps {
  tripId: string
  destinations?: Destination[]
  activities?: Activity[]
  accommodations?: Accommodation[]
  onDestinationClick?: (destination: Destination) => void
  onActivityClick?: (activity: Activity) => void
  onAccommodationClick?: (accommodation: Accommodation) => void
  className?: string
  showRoute?: boolean
  showControls?: boolean
}

// Component to handle automatic bounds fitting
function FitBounds({
  destinations,
  activities,
  accommodations,
}: {
  destinations?: Destination[]
  activities?: Activity[]
  accommodations?: Accommodation[]
}) {
  const map = useMap()

  useEffect(() => {
    const allCoords: [number, number][] = []

    // Collect all coordinates
    destinations?.forEach((d) => {
      if (d.latitude !== undefined && d.longitude !== undefined) {
        allCoords.push([d.latitude, d.longitude])
      }
    })

    activities?.forEach((a) => {
      if (a.latitude !== undefined && a.longitude !== undefined) {
        allCoords.push([a.latitude, a.longitude])
      }
    })

    accommodations?.forEach((a) => {
      if (a.latitude !== undefined && a.longitude !== undefined) {
        allCoords.push([a.latitude, a.longitude])
      }
    })

    // Fit bounds if we have coordinates
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords)
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      })
    }
  }, [map, destinations, activities, accommodations])

  return null
}

// Component to handle layer switching
function TileLayerSwitcher({ layer }: { layer: LayerType }) {
  const tileConfig = tileLayers[layer]

  return (
    <TileLayer
      key={layer}
      url={tileConfig.url}
      attribution={tileConfig.attribution}
    />
  )
}

export function TripMap({
  destinations = [],
  activities = [],
  accommodations = [],
  onDestinationClick,
  onActivityClick,
  onAccommodationClick,
  className = '',
  showRoute = true,
  showControls = true,
}: TripMapProps) {
  const [currentLayer, setCurrentLayer] = useState<LayerType>('standard')

  // Sort destinations by order for route
  const sortedDestinations = useMemo(() => {
    return [...destinations].sort((a, b) => a.order - b.order)
  }, [destinations])

  // Get route positions from destinations
  const routePositions = useMemo((): [number, number][] => {
    return sortedDestinations
      .filter((d) => d.latitude !== undefined && d.longitude !== undefined)
      .map((d) => [d.latitude!, d.longitude!])
  }, [sortedDestinations])

  // Calculate initial center and zoom
  const initialCenter = useMemo((): [number, number] => {
    const firstDestination = sortedDestinations.find(
      (d) => d.latitude !== undefined && d.longitude !== undefined
    )
    if (firstDestination) {
      return [firstDestination.latitude!, firstDestination.longitude!]
    }
    return DEFAULT_CENTER
  }, [sortedDestinations])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      >
        <TileLayerSwitcher layer={currentLayer} />

        {/* Auto-fit bounds */}
        <FitBounds
          destinations={destinations}
          activities={activities}
          accommodations={accommodations}
        />

        {/* Route between destinations */}
        {showRoute && routePositions.length >= 2 && (
          <RoutePolyline positions={routePositions} />
        )}

        {/* Destination markers */}
        {sortedDestinations.map((destination, index) => (
          <DestinationMarker
            key={destination.id}
            destination={destination}
            index={index}
            onClick={onDestinationClick}
          />
        ))}

        {/* Activity markers */}
        {activities.map((activity) => (
          <ActivityMarker
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
          />
        ))}

        {/* Accommodation markers */}
        {accommodations.map((accommodation) => (
          <AccommodationMarker
            key={accommodation.id}
            accommodation={accommodation}
            onClick={onAccommodationClick}
          />
        ))}

        {/* Map controls */}
        {showControls && (
          <MapControls
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            onLayerChange={setCurrentLayer}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card rounded-lg shadow-lg p-3 border border-border">
        <h4 className="text-xs font-semibold text-foreground mb-2">Legende</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-card shadow" />
            <span className="text-muted-foreground">Reiseziele</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-card shadow" />
            <span className="text-muted-foreground">Unterkünfte</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-card shadow" />
            <span className="text-muted-foreground">Aktivitäten</span>
          </div>
        </div>
      </div>
    </div>
  )
}
