import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { useItineraryStore, useTripStore } from '@/stores'
import { DayCard } from './DayCard'
import type { Activity, Destination } from '@/types'

interface DayPlannerProps {
  tripId: string
  startDate?: string
  endDate?: string
}

export function DayPlanner({ tripId, startDate, endDate }: DayPlannerProps) {
  // Guard-Clause: Wenn keine Daten vorhanden, nichts anzeigen
  if (!startDate || !endDate) {
    return null
  }

  const {
    getDayPlansByTrip,
    getDayPlanByDate,
    addDayPlan,
    reorderActivities,
  } = useItineraryStore()

  const { getTrip } = useTripStore()
  const trip = getTrip(tripId)
  const destinations = trip?.destinations ?? []

  // Helper: Findet das Reiseziel für ein bestimmtes Datum
  const getDestinationForDate = (date: string): Destination | undefined => {
    return destinations.find((dest) => {
      if (!dest.arrivalDate || !dest.departureDate) return false
      return dest.arrivalDate <= date && date <= dest.departureDate
    })
  }

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Generate all days between start and end date
  const allDays = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  })

  // Create missing DayPlans on mount
  useEffect(() => {
    allDays.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const existingDayPlan = getDayPlanByDate(tripId, dateStr)

      if (!existingDayPlan) {
        const destination = getDestinationForDate(dateStr)
        addDayPlan({
          tripId,
          date: dateStr,
          destinationId: destination?.id,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when date range changes
  }, [tripId, startDate, endDate])

  const dayPlans = getDayPlansByTrip(tripId)

  // Create a map of date to dayPlan for quick lookup
  const dayPlansByDate = new Map(
    dayPlans.map((dayPlan) => [dayPlan.date, dayPlan])
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    // Find the activity being dragged
    for (const dayPlan of dayPlans) {
      const activity = dayPlan.activities.find((a) => a.id === active.id)
      if (activity) {
        setActiveActivity(activity)
        break
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveActivity(null)

    if (!over || active.id === over.id) {
      return
    }

    // Find which dayPlan contains the active item
    let sourceDayPlan = null
    for (const dayPlan of dayPlans) {
      if (dayPlan.activities.some((a) => a.id === active.id)) {
        sourceDayPlan = dayPlan
        break
      }
    }

    if (!sourceDayPlan) return

    // Find the indices
    const oldIndex = sourceDayPlan.activities.findIndex(
      (a) => a.id === active.id
    )
    const newIndex = sourceDayPlan.activities.findIndex((a) => a.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    // Reorder activities within the same day
    const newActivityOrder = arrayMove(
      sourceDayPlan.activities.map((a) => a.id),
      oldIndex,
      newIndex
    )

    reorderActivities(sourceDayPlan.id, newActivityOrder)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {allDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayPlan = dayPlansByDate.get(dateStr)

          if (!dayPlan) {
            return null
          }

          const destination = getDestinationForDate(dateStr)

          return (
            <DayCard
              key={dayPlan.id}
              dayPlan={dayPlan}
              date={dateStr}
              destinationName={destination?.name}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeActivity ? (
          <div className="rounded-lg border bg-card p-3 shadow-lg opacity-90">
            <div className="font-medium text-sm">{activeActivity.title}</div>
            {activeActivity.startTime && (
              <div className="text-xs text-muted-foreground mt-1">
                {activeActivity.startTime}
                {activeActivity.endTime && ` - ${activeActivity.endTime}`}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
