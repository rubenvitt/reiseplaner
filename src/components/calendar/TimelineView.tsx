import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, addHours, startOfDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useItineraryStore } from '@/stores/itineraryStore'
import { Button } from '@/components/ui'
import { CalendarEvent, categoryColors } from './CalendarEvent'
import type { Activity } from '@/types'

interface TimelineViewProps {
  tripId: string
  currentDate: Date
  onActivityClick?: (activity: Activity) => void
}

interface SortableActivityProps {
  activity: Activity
  zoomLevel: number
  onActivityClick?: (activity: Activity) => void
}

// Zoom levels: hours per pixel ratio
const ZOOM_LEVELS = [0.5, 1, 2, 4] // 0.5 = sehr gezoomt, 4 = uebersichtlich

function SortableActivity({ activity, zoomLevel, onActivityClick }: SortableActivityProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Berechne Position und Breite basierend auf Zeit
  const getTimePosition = () => {
    if (!activity.startTime) return { left: 0, width: 120 }

    const [hours, minutes] = activity.startTime.split(':').map(Number)
    const startMinutes = hours * 60 + minutes
    const left = (startMinutes / 60) * (60 / zoomLevel)

    let width = 120 // Standard-Breite
    if (activity.endTime) {
      const [endHours, endMinutes] = activity.endTime.split(':').map(Number)
      const endMinutesTotal = endHours * 60 + endMinutes
      const duration = endMinutesTotal - startMinutes
      width = Math.max((duration / 60) * (60 / zoomLevel), 80)
    }

    return { left, width }
  }

  const { left, width } = getTimePosition()

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: `${left}px`,
        width: `${width}px`,
        top: '8px',
        bottom: '8px',
      }}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isDragging && 'z-50'
      )}
      {...attributes}
      {...listeners}
    >
      <CalendarEvent
        activity={activity}
        variant="timeline"
        isDragging={isDragging}
        onClick={() => onActivityClick?.(activity)}
      />
    </div>
  )
}

export function TimelineView({
  tripId,
  currentDate,
  onActivityClick,
}: TimelineViewProps) {
  const [zoomIndex, setZoomIndex] = useState(1)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)

  const { getDayPlanByDate, updateActivity } = useItineraryStore()

  const zoomLevel = ZOOM_LEVELS[zoomIndex]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const dateStr = format(currentDate, 'yyyy-MM-dd')
  const dayPlan = getDayPlanByDate(tripId, dateStr)
  const activities = useMemo(() => {
    return dayPlan?.activities.sort((a, b) => {
      if (!a.startTime) return 1
      if (!b.startTime) return -1
      return a.startTime.localeCompare(b.startTime)
    }) || []
  }, [dayPlan])

  // Stunden fuer die Timeline (0-23)
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i)
  }, [])

  // Timeline-Breite basierend auf Zoom
  const timelineWidth = (24 * 60) / zoomLevel

  const handleZoomIn = () => {
    if (zoomIndex > 0) setZoomIndex(zoomIndex - 1)
  }

  const handleZoomOut = () => {
    if (zoomIndex < ZOOM_LEVELS.length - 1) setZoomIndex(zoomIndex + 1)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const activity = activities.find((a) => a.id === event.active.id)
    if (activity) setActiveActivity(activity)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActivity(null)

    const { active, over, delta } = event
    if (!over || !dayPlan) return

    // Berechne neue Zeit basierend auf Drag-Delta
    const activity = activities.find((a) => a.id === active.id)
    if (!activity || !activity.startTime) return

    const deltaMinutes = Math.round((delta.x * zoomLevel) / (60 / 60))
    const [hours, minutes] = activity.startTime.split(':').map(Number)
    const newMinutes = Math.max(0, Math.min(23 * 60 + 59, hours * 60 + minutes + deltaMinutes))

    const newHours = Math.floor(newMinutes / 60)
    const newMins = newMinutes % 60

    const newStartTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`

    // Update End-Zeit proportional
    let newEndTime: string | undefined
    if (activity.endTime) {
      const [endHours, endMins] = activity.endTime.split(':').map(Number)
      const endTotalMins = endHours * 60 + endMins + deltaMinutes
      const clampedEndMins = Math.max(0, Math.min(23 * 60 + 59, endTotalMins))
      const newEndHours = Math.floor(clampedEndMins / 60)
      const newEndMinutes = clampedEndMins % 60
      newEndTime = `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes).padStart(2, '0')}`
    }

    updateActivity(dayPlan.id, activity.id, {
      startTime: newStartTime,
      ...(newEndTime && { endTime: newEndTime }),
    })
  }

  return (
    <div className="space-y-4">
      {/* Header mit Datum und Zoom-Kontrollen */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(currentDate, 'EEEE, d. MMMM yyyy', { locale: de })}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Zoom:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomIndex === 0}
            aria-label="Vergroessern"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Verkleinern"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="relative bg-card rounded-lg border min-h-[200px]"
            style={{ width: `${timelineWidth}px` }}
          >
            {/* Stunden-Markierungen */}
            <div className="flex border-b">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-shrink-0 border-r border-dashed border-border/50 text-center"
                  style={{ width: `${60 / zoomLevel}px` }}
                >
                  <span className="text-xs text-muted-foreground">
                    {format(addHours(startOfDay(new Date()), hour), 'HH:mm')}
                  </span>
                </div>
              ))}
            </div>

            {/* Stunden-Raster (vertikale Linien) */}
            <div className="absolute top-8 bottom-0 left-0 right-0 flex pointer-events-none">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-shrink-0 border-r border-dashed border-border/30"
                  style={{ width: `${60 / zoomLevel}px` }}
                />
              ))}
            </div>

            {/* Aktuelle Zeit-Linie */}
            {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-8 bottom-0 w-0.5 bg-destructive z-30"
                style={{
                  left: `${((new Date().getHours() * 60 + new Date().getMinutes()) / 60) * (60 / zoomLevel)}px`,
                }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-destructive" />
              </motion.div>
            )}

            {/* Aktivitaeten */}
            <div className="relative h-[120px]">
              <SortableContext
                items={activities.map((a) => a.id)}
                strategy={horizontalListSortingStrategy}
              >
                {activities.map((activity) => (
                  <SortableActivity
                    key={activity.id}
                    activity={activity}
                    zoomLevel={zoomLevel}
                    onActivityClick={onActivityClick}
                  />
                ))}
              </SortableContext>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeActivity && (
                <div className="w-[120px] h-[100px] opacity-80">
                  <CalendarEvent
                    activity={activeActivity}
                    variant="timeline"
                    isDragging
                  />
                </div>
              )}
            </DragOverlay>
          </div>
        </DndContext>
      </div>

      {/* Legende */}
      <div className="flex flex-wrap gap-3 pt-2 border-t">
        {Object.entries(categoryColors).map(([category, colors]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span className={cn('w-3 h-3 rounded', colors.dot)} />
            <span className="text-xs text-muted-foreground capitalize">
              {category === 'sightseeing' ? 'Sehenswuerdigkeit' :
               category === 'food' ? 'Essen' :
               category === 'transport' ? 'Transport' :
               category === 'activity' ? 'Aktivitaet' :
               category === 'relaxation' ? 'Entspannung' :
               category === 'shopping' ? 'Shopping' : 'Sonstiges'}
            </span>
          </div>
        ))}
      </div>

      {/* Hinweis wenn keine Aktivitaeten */}
      {activities.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 text-muted-foreground"
        >
          <p>Keine Aktivitaeten fuer diesen Tag geplant.</p>
          <p className="text-sm mt-1">
            Wechsle zur Itinerary-Ansicht, um Aktivitaeten hinzuzufuegen.
          </p>
        </motion.div>
      )}
    </div>
  )
}
