import { useState } from 'react'
import { Marker, Popup } from 'react-map-gl/mapbox'
import type { MapLocation } from '@/hooks/useMapLocations'

interface StackedMapMarkerProps {
  locations: MapLocation[]
  coordinates: { latitude: number; longitude: number }
  isSelected?: boolean
  onClick?: (location: MapLocation) => void
}

const markerColors: Record<MapLocation['type'], string> = {
  destination: '#3b82f6', // blue
  accommodation: '#22c55e', // green
  transport_origin: '#f97316', // orange
  transport_destination: '#ef4444', // red
  activity: '#a855f7', // purple
}

const markerIcons: Record<MapLocation['type'], React.ReactNode> = {
  destination: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
    />
  ),
  accommodation: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  ),
  transport_origin: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
  transport_destination: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
  ),
  activity: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
}

const typeLabels: Record<MapLocation['type'], string> = {
  destination: 'Reiseziel',
  accommodation: 'Unterkunft',
  transport_origin: 'Abfahrt',
  transport_destination: 'Ankunft',
  activity: 'Aktivität',
}

export function StackedMapMarker({ locations, coordinates, isSelected, onClick }: StackedMapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const count = locations.length

  // Use mixed color gradient for stacked marker
  const primaryColor = '#6366f1' // indigo for stacked markers

  return (
    <>
      <Marker
        longitude={coordinates.longitude}
        latitude={coordinates.latitude}
        anchor="bottom"
        onClick={(e: { originalEvent: MouseEvent }) => {
          e.originalEvent.stopPropagation()
          setShowPopup(true)
        }}
      >
        <div
          className={`cursor-pointer transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
        >
          <div
            className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-white font-bold text-sm">{count}</span>
            {/* Stacked effect rings */}
            <div
              className="absolute -z-10 w-10 h-10 rounded-full opacity-40"
              style={{ backgroundColor: primaryColor, transform: 'translate(2px, 2px)' }}
            />
            <div
              className="absolute -z-20 w-10 h-10 rounded-full opacity-20"
              style={{ backgroundColor: primaryColor, transform: 'translate(4px, 4px)' }}
            />
          </div>
          <div
            className="w-0 h-0 mx-auto -mt-1"
            style={{
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `9px solid ${primaryColor}`,
            }}
          />
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={coordinates.longitude}
          latitude={coordinates.latitude}
          anchor="bottom"
          offset={[0, -48]}
          onClose={() => {
            setShowPopup(false)
            setExpandedIndex(null)
          }}
          closeButton={true}
          closeOnClick={false}
          className="map-popup"
          maxWidth="320px"
        >
          <div className="p-2 min-w-[280px] max-h-[300px] overflow-y-auto">
            <div className="text-xs text-muted-foreground mb-2 pb-2 border-b border-border">
              {count} Orte an dieser Position
            </div>
            <div className="space-y-2">
              {locations.map((location, index) => {
                const color = markerColors[location.type]
                const icon = markerIcons[location.type]
                const isExpanded = expandedIndex === index

                return (
                  <div
                    key={location.id}
                    className="rounded-lg border border-border overflow-hidden"
                  >
                    <button
                      type="button"
                      className="w-full p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => {
                        setExpandedIndex(isExpanded ? null : index)
                        onClick?.(location)
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {icon}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">{typeLabels[location.type]}</div>
                        <div className="font-medium text-sm text-foreground truncate">{location.name}</div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-2 pb-2 pt-1 border-t border-border bg-muted/30">
                        {location.address && (
                          <p className="text-xs text-muted-foreground mb-1">{location.address}</p>
                        )}
                        {location.details && (
                          <div className="space-y-0.5">
                            {Object.entries(location.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-muted-foreground capitalize">{key}:</span>
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Popup>
      )}
    </>
  )
}
