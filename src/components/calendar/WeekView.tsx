import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  format,
  addHours,
  startOfDay,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useItineraryStore } from '@/stores/itineraryStore'
import { CalendarEvent } from './CalendarEvent'
import { staggerContainer, staggerItem } from '@/lib/animations'
import type { Activity } from '@/types'

interface WeekViewProps {
  tripId: string
  currentDate: Date
  startDate: Date
  endDate: Date
  onActivityClick?: (activity: Activity) => void
  showHours?: boolean
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function WeekView({
  tripId,
  currentDate,
  startDate,
  endDate,
  onActivityClick,
  showHours = true,
}: WeekViewProps) {
  const { getDayPlansByTrip } = useItineraryStore()

  const dayPlans = useMemo(() => {
    return getDayPlansByTrip(tripId)
  }, [tripId, getDayPlansByTrip])

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  const getActivitiesForDay = (date: Date): Activity[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayPlan = dayPlans.find((dp) => dp.date === dateStr)
    return dayPlan?.activities.sort((a, b) => {
      if (!a.startTime) return 1
      if (!b.startTime) return -1
      return a.startTime.localeCompare(b.startTime)
    }) || []
  }

  const isInTripRange = (date: Date) => {
    return isWithinInterval(date, { start: startDate, end: endDate })
  }

  const today = new Date()

  // Aktivitäten nach Stunde gruppieren
  const getActivityPosition = (activity: Activity) => {
    if (!activity.startTime) return null
    const [hours, minutes] = activity.startTime.split(':').map(Number)
    const top = (hours + minutes / 60) * 60 // 60px pro Stunde

    let height = 60 // Standard 1 Stunde
    if (activity.endTime) {
      const [endHours, endMinutes] = activity.endTime.split(':').map(Number)
      const duration = (endHours + endMinutes / 60) - (hours + minutes / 60)
      height = Math.max(duration * 60, 30) // Mindestens 30px
    }

    return { top, height }
  }

  if (!showHours) {
    // Einfache Ansicht ohne Stunden-Raster
    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const activities = getActivitiesForDay(day)
          const isToday = isSameDay(day, today)
          const inTripRange = isInTripRange(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'min-h-[400px] p-2 rounded-lg border bg-card',
                !inTripRange && 'bg-muted/30 opacity-60'
              )}
            >
              {/* Day Header */}
              <div className={cn(
                'text-center pb-2 mb-2 border-b',
                isToday && 'text-primary'
              )}>
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, 'EEE', { locale: de })}
                </div>
                <div className={cn(
                  'text-lg font-semibold',
                  isToday && 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                )}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Activities */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                {activities.map((activity) => (
                  <motion.div key={activity.id} variants={staggerItem}>
                    <CalendarEvent
                      activity={activity}
                      variant="full"
                      onClick={() => onActivityClick?.(activity)}
                    />
                  </motion.div>
                ))}

                {activities.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Keine Aktivitäten
                  </p>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Stunden-Raster Ansicht
  return (
    <div className="flex gap-2 overflow-auto">
      {/* Zeit-Spalte */}
      <div className="w-16 flex-shrink-0 pt-12">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="h-[60px] text-xs text-muted-foreground text-right pr-2 -mt-2"
          >
            {format(addHours(startOfDay(new Date()), hour), 'HH:mm')}
          </div>
        ))}
      </div>

      {/* Tages-Spalten */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {weekDays.map((day, idx) => {
          const activities = getActivitiesForDay(day)
          const isToday = isSameDay(day, today)
          const inTripRange = isInTripRange(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'flex-1 min-w-[120px]',
                !inTripRange && 'opacity-50'
              )}
            >
              {/* Day Header */}
              <div className={cn(
                'text-center pb-2 mb-2 sticky top-0 bg-background z-10',
                isToday && 'text-primary'
              )}>
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, 'EEE', { locale: de })}
                </div>
                <div className={cn(
                  'text-lg font-semibold',
                  isToday && 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                )}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Stunden-Raster mit Aktivitäten */}
              <div className="relative border-l border-border">
                {/* Stunden-Linien */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-dashed border-border/50"
                  />
                ))}

                {/* Aktivitäten */}
                {activities.map((activity) => {
                  const position = getActivityPosition(activity)

                  if (!position) {
                    // Aktivität ohne Zeitangabe am Anfang anzeigen
                    return (
                      <div
                        key={activity.id}
                        className="absolute top-0 left-1 right-1 z-10"
                      >
                        <CalendarEvent
                          activity={activity}
                          variant="full"
                          onClick={() => onActivityClick?.(activity)}
                        />
                      </div>
                    )
                  }

                  return (
                    <div
                      key={activity.id}
                      className="absolute left-1 right-1 z-10"
                      style={{
                        top: `${position.top}px`,
                        height: `${position.height}px`,
                      }}
                    >
                      <CalendarEvent
                        activity={activity}
                        variant="timeline"
                        onClick={() => onActivityClick?.(activity)}
                      />
                    </div>
                  )
                })}

                {/* Aktuelle Zeit-Linie */}
                {isToday && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{
                      top: `${(today.getHours() + today.getMinutes() / 60) * 60}px`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <div className="flex-1 h-0.5 bg-destructive" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
