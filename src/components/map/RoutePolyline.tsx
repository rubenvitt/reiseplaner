import { Polyline, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import L from 'leaflet'

interface RoutePolylineProps {
  positions: [number, number][]
  color?: string
  showArrows?: boolean
}

export function RoutePolyline({
  positions,
  color = '#3b82f6',
  showArrows = true,
}: RoutePolylineProps) {
  const map = useMap()
  const arrowMarkersRef = useRef<L.Marker[]>([])

  // Clean up arrow markers
  useEffect(() => {
    return () => {
      arrowMarkersRef.current.forEach(marker => {
        marker.remove()
      })
      arrowMarkersRef.current = []
    }
  }, [])

  // Add arrow markers at line midpoints
  useEffect(() => {
    // Remove existing arrows
    arrowMarkersRef.current.forEach(marker => {
      marker.remove()
    })
    arrowMarkersRef.current = []

    if (!showArrows || positions.length < 2) return

    // Add arrow at each segment midpoint
    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i]
      const end = positions[i + 1]

      // Calculate midpoint
      const midLat = (start[0] + end[0]) / 2
      const midLng = (start[1] + end[1]) / 2

      // Calculate angle
      const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * (180 / Math.PI)

      const arrowIcon = L.divIcon({
        className: 'route-arrow',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${angle - 90}deg);
          ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="16" height="16">
              <path d="M12 2l-8 14h16L12 2z"/>
            </svg>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const marker = L.marker([midLat, midLng], {
        icon: arrowIcon,
        interactive: false,
      }).addTo(map)

      arrowMarkersRef.current.push(marker)
    }
  }, [map, positions, color, showArrows])

  if (positions.length < 2) {
    return null
  }

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: color,
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  )
}
