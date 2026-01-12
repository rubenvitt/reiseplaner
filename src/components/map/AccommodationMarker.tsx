import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { formatDateOrPlaceholder } from '@/lib/utils'
import type { Accommodation, AccommodationType } from '@/types'

// Accommodation type labels
const typeLabels: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  airbnb: 'Airbnb',
  hostel: 'Hostel',
  apartment: 'Apartment',
  camping: 'Camping',
  other: 'Sonstiges',
}

// House icon SVG
const houseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
`

// Custom accommodation marker icon
const accommodationIcon = L.divIcon({
  className: 'custom-accommodation-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      border: 2px solid white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      ${houseIcon}
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface AccommodationMarkerProps {
  accommodation: Accommodation
  onClick?: (accommodation: Accommodation) => void
}

export function AccommodationMarker({
  accommodation,
  onClick,
}: AccommodationMarkerProps) {
  const {
    name,
    type,
    address,
    checkIn,
    checkOut,
    latitude,
    longitude,
    confirmationNumber,
  } = accommodation

  // Skip if no coordinates
  if (latitude === undefined || longitude === undefined) {
    return null
  }

  return (
    <Marker
      position={[latitude, longitude]}
      icon={accommodationIcon}
      eventHandlers={{
        click: () => onClick?.(accommodation),
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
              {typeLabels[type]}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{address}</p>
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Check-in:</span> {formatDateOrPlaceholder(checkIn)}
            </p>
            <p>
              <span className="font-medium">Check-out:</span> {formatDateOrPlaceholder(checkOut)}
            </p>
          </div>
          {confirmationNumber && (
            <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
              <span className="font-medium">Buchungsnr.:</span> {confirmationNumber}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
