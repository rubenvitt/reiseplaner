import { useMap } from 'react-leaflet'
import { useState } from 'react'
import {
  Plus,
  Minus,
  Locate,
  RotateCcw,
  Layers,
  Map as MapIcon,
  Satellite,
  Mountain,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type LayerType = 'standard' | 'satellite' | 'terrain'

interface MapControlsProps {
  defaultCenter?: [number, number]
  defaultZoom?: number
  onLayerChange?: (layer: LayerType) => void
  showLayerSwitcher?: boolean
}

export function MapControls({
  defaultCenter = [51.1657, 10.4515], // Germany center
  defaultZoom = 6,
  onLayerChange,
  showLayerSwitcher = true,
}: MapControlsProps) {
  const map = useMap()
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false)
  const [currentLayer, setCurrentLayer] = useState<LayerType>('standard')
  const [isLocating, setIsLocating] = useState(false)

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  const handleLocate = () => {
    setIsLocating(true)

    map.locate({ setView: true, maxZoom: 14 })

    map.once('locationfound', () => {
      setIsLocating(false)
    })

    map.once('locationerror', () => {
      setIsLocating(false)
      // Show user-friendly error could be added here
    })

    // Timeout fallback
    setTimeout(() => {
      setIsLocating(false)
    }, 10000)
  }

  const handleResetView = () => {
    map.setView(defaultCenter, defaultZoom)
  }

  const handleLayerChange = (layer: LayerType) => {
    setCurrentLayer(layer)
    setIsLayerMenuOpen(false)
    onLayerChange?.(layer)
  }

  const layers: { id: LayerType; label: string; icon: typeof MapIcon }[] = [
    { id: 'standard', label: 'Standard', icon: MapIcon },
    { id: 'satellite', label: 'Satellit', icon: Satellite },
    { id: 'terrain', label: 'Gelaende', icon: Mountain },
  ]

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Hineinzoomen"
          aria-label="Hineinzoomen"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Herauszoomen"
          aria-label="Herauszoomen"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Locate Button */}
      <button
        onClick={handleLocate}
        disabled={isLocating}
        className={cn(
          'p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors',
          isLocating && 'animate-pulse'
        )}
        title="Mein Standort"
        aria-label="Mein Standort"
      >
        <Locate
          className={cn(
            'w-5 h-5',
            isLocating ? 'text-blue-500' : 'text-gray-700'
          )}
        />
      </button>

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        title="Ansicht zuruecksetzen"
        aria-label="Ansicht zuruecksetzen"
      >
        <RotateCcw className="w-5 h-5 text-gray-700" />
      </button>

      {/* Layer Switcher */}
      {showLayerSwitcher && (
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className={cn(
              'p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors',
              isLayerMenuOpen && 'bg-gray-100'
            )}
            title="Kartentyp wechseln"
            aria-label="Kartentyp wechseln"
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>

          {/* Layer Menu */}
          {isLayerMenuOpen && (
            <div className="absolute top-0 right-12 bg-white rounded-lg shadow-lg overflow-hidden min-w-[140px]">
              {layers.map((layer) => {
                const Icon = layer.icon
                return (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerChange(layer.id)}
                    className={cn(
                      'w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors text-left',
                      currentLayer === layer.id && 'bg-blue-50 text-blue-600'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{layer.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
