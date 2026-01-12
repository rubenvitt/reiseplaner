import { useState } from 'react'
import { Marker, Popup } from 'react-map-gl/mapbox'
import type { MapLocation } from '@/hooks/useMapLocations'

interface MapMarkerProps {
  location: MapLocation
  isSelected?: boolean
  onClick?: () => void
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

export function MapMarker({ location, isSelected, onClick }: MapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false)

  if (!location.coordinates) return null

  const color = markerColors[location.type]
  const icon = markerIcons[location.type]

  return (
    <>
      <Marker
        longitude={location.coordinates.longitude}
        latitude={location.coordinates.latitude}
        anchor="bottom"
        onClick={(e: { originalEvent: MouseEvent }) => {
          e.originalEvent.stopPropagation()
          setShowPopup(true)
          onClick?.()
        }}
      >
        <div
          className={`cursor-pointer transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: color }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
          </div>
          <div
            className="w-0 h-0 mx-auto -mt-1"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `8px solid ${color}`,
            }}
          />
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={location.coordinates.longitude}
          latitude={location.coordinates.latitude}
          anchor="bottom"
          offset={[0, -40]}
          onClose={() => setShowPopup(false)}
          closeButton={true}
          closeOnClick={false}
          className="map-popup"
        >
          <div className="p-2 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-500">{typeLabels[location.type]}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{location.name}</h3>
            {location.address && (
              <p className="text-xs text-gray-600 mt-1">{location.address}</p>
            )}
            {location.details && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                {Object.entries(location.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="text-gray-700">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Popup>
      )}
    </>
  )
}
