import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useItineraryStore } from '@/stores/itineraryStore'
import { CalendarEvent } from './CalendarEvent'
import type { Activity } from '@/types'

interface MonthViewProps {
  tripId: string
  currentDate: Date
  startDate: Date
  endDate: Date
  onDayClick?: (date: Date) => void
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export function MonthView({
  tripId,
  currentDate,
  startDate,
  endDate,
  onDayClick,
}: MonthViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const { getDayPlansByTrip } = useItineraryStore()

  const dayPlans = useMemo(() => {
    return getDayPlansByTrip(tripId)
  }, [tripId, getDayPlansByTrip])

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  const getActivitiesForDay = (date: Date): Activity[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayPlan = dayPlans.find((dp) => dp.date === dateStr)
    return dayPlan?.activities || []
  }

  const isInTripRange = (date: Date) => {
    return isWithinInterval(date, { start: startDate, end: endDate })
  }

  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
    onDayClick?.(date)
  }

  const today = new Date()

  return (
    <div className="select-none">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden"
      >
        {days.map((day, idx) => {
          const activities = getActivitiesForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, today)
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const inTripRange = isInTripRange(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.01 }}
              onClick={() => handleDayClick(day)}
              className={cn(
                'min-h-[100px] p-2 bg-card cursor-pointer',
                'transition-colors duration-200',
                !isCurrentMonth && 'bg-muted/50 text-muted-foreground',
                inTripRange && isCurrentMonth && 'bg-primary/5',
                isSelected && 'ring-2 ring-primary ring-inset',
                'hover:bg-accent/50'
              )}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    'flex items-center justify-center w-7 h-7 text-sm rounded-full',
                    isToday && 'bg-primary text-primary-foreground font-bold',
                    !isToday && inTripRange && 'font-medium',
                    !isCurrentMonth && 'text-muted-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Activity Count Badge */}
                {activities.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {activities.length}
                  </span>
                )}
              </div>

              {/* Activities Preview */}
              <div className="space-y-0.5">
                {activities.slice(0, 3).map((activity) => (
                  <CalendarEvent
                    key={activity.id}
                    activity={activity}
                    variant="compact"
                  />
                ))}

                {activities.length > 3 && (
                  <span className="text-xs text-muted-foreground pl-1">
                    +{activities.length - 3} weitere
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Selected Day Detail View */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  {format(selectedDay, 'EEEE, d. MMMM yyyy', { locale: de })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Schließen
                </button>
              </div>

              {getActivitiesForDay(selectedDay).length > 0 ? (
                <div className="space-y-2">
                  {getActivitiesForDay(selectedDay).map((activity) => (
                    <CalendarEvent
                      key={activity.id}
                      activity={activity}
                      variant="full"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Keine Aktivitäten für diesen Tag geplant.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
