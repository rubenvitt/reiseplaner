import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Activity, ActivityCategory } from '@/types'

// Category colors and icons
const categoryConfig: Record<ActivityCategory, { color: string; icon: string }> = {
  sightseeing: { color: '#f59e0b', icon: 'eye' }, // Amber
  food: { color: '#ef4444', icon: 'utensils' }, // Red
  transport: { color: '#6366f1', icon: 'car' }, // Indigo
  activity: { color: '#22c55e', icon: 'zap' }, // Green
  relaxation: { color: '#06b6d4', icon: 'coffee' }, // Cyan
  shopping: { color: '#ec4899', icon: 'bag' }, // Pink
  other: { color: '#6b7280', icon: 'circle' }, // Gray
}

// SVG icons for categories
const categoryIcons: Record<string, string> = {
  eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  car: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
  bag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/></svg>`,
}

// Category translations
const categoryLabels: Record<ActivityCategory, string> = {
  sightseeing: 'Sehenswuerdigkeit',
  food: 'Essen & Trinken',
  transport: 'Transport',
  activity: 'Aktivitaet',
  relaxation: 'Erholung',
  shopping: 'Shopping',
  other: 'Sonstiges',
}

function createActivityIcon(category: ActivityCategory): L.DivIcon {
  const config = categoryConfig[category]
  const iconSvg = categoryIcons[config.icon]

  return L.divIcon({
    className: 'custom-activity-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${config.color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        ${iconSvg}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

interface ActivityMarkerProps {
  activity: Activity
  onClick?: (activity: Activity) => void
}

export function ActivityMarker({ activity, onClick }: ActivityMarkerProps) {
  const { title, startTime, endTime, location, category, latitude, longitude } = activity

  // Skip if no coordinates
  if (latitude === undefined || longitude === undefined) {
    return null
  }

  const icon = createActivityIcon(category)
  const config = categoryConfig[category]

  return (
    <Marker
      position={[latitude, longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(activity),
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-xs text-gray-500">
              {categoryLabels[category]}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {(startTime || endTime) && (
            <p className="text-sm text-gray-600">
              {startTime && <span>{startTime}</span>}
              {startTime && endTime && <span> - </span>}
              {endTime && <span>{endTime}</span>}
            </p>
          )}
          {location && (
            <p className="text-xs text-gray-500 mt-1">{location}</p>
          )}
          {activity.description && (
            <p className="mt-2 text-xs text-gray-600 border-t pt-2">
              {activity.description}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
