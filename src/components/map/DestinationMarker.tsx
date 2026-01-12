import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { formatDate } from '@/lib/utils'
import type { Destination } from '@/types'

// Custom blue destination marker icon
const destinationIcon = L.divIcon({
  className: 'custom-destination-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 14px;
      "></span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface DestinationMarkerProps {
  destination: Destination
  index?: number
  onClick?: (destination: Destination) => void
}

export function DestinationMarker({
  destination,
  index,
  onClick,
}: DestinationMarkerProps) {
  const { name, country, arrivalDate, departureDate, latitude, longitude } = destination

  // Skip if no coordinates
  if (latitude === undefined || longitude === undefined) {
    return null
  }

  // Create icon with index number if provided
  const icon = index !== undefined
    ? L.divIcon({
        className: 'custom-destination-marker',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: bold;
              font-size: 14px;
            ">${index + 1}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })
    : destinationIcon

  return (
    <Marker
      position={[latitude, longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(destination),
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{country}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Ankunft:</span> {formatDate(arrivalDate)}
            </p>
            <p>
              <span className="font-medium">Abreise:</span> {formatDate(departureDate)}
            </p>
          </div>
          {destination.notes && (
            <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
              {destination.notes}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
