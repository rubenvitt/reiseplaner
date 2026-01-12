import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
  startOfDay,
  isWithinInterval,
} from 'date-fns'
import { CalendarHeader, type ViewMode } from './CalendarHeader'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { TimelineView } from './TimelineView'
import type { Activity } from '@/types'

interface CalendarViewProps {
  tripId: string
  startDate?: string
  endDate?: string
  onActivityClick?: (activity: Activity) => void
  onDayClick?: (date: Date) => void
  initialViewMode?: ViewMode
}

export function CalendarView({
  tripId,
  startDate,
  endDate,
  onActivityClick,
  onDayClick,
  initialViewMode = 'month',
}: CalendarViewProps) {
  // Guard-Clause: Wenn keine Daten vorhanden, nichts anzeigen
  if (!startDate || !endDate) {
    return null
  }

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const start = parseISO(startDate)
    const today = new Date()

    // Wenn heute im Trip-Zeitraum liegt, zeige heute an
    // Sonst zeige den Start des Trips
    if (isWithinInterval(today, { start: parseISO(startDate), end: parseISO(endDate) })) {
      return startOfDay(today)
    }
    return start
  })

  const tripStartDate = useMemo(() => parseISO(startDate), [startDate])
  const tripEndDate = useMemo(() => parseISO(endDate), [endDate])

  const handlePrevious = useCallback(() => {
    switch (viewMode) {
      case 'month':
        setCurrentDate((prev) => subMonths(prev, 1))
        break
      case 'week':
        setCurrentDate((prev) => subWeeks(prev, 1))
        break
      case 'timeline':
        setCurrentDate((prev) => subDays(prev, 1))
        break
    }
  }, [viewMode])

  const handleNext = useCallback(() => {
    switch (viewMode) {
      case 'month':
        setCurrentDate((prev) => addMonths(prev, 1))
        break
      case 'week':
        setCurrentDate((prev) => addWeeks(prev, 1))
        break
      case 'timeline':
        setCurrentDate((prev) => addDays(prev, 1))
        break
    }
  }, [viewMode])

  const handleToday = useCallback(() => {
    setCurrentDate(startOfDay(new Date()))
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  const handleDayClick = useCallback((date: Date) => {
    // Bei Klick auf einen Tag in der Monatsansicht zur Timeline wechseln
    setCurrentDate(date)
    if (viewMode === 'month') {
      setViewMode('timeline')
    }
    onDayClick?.(date)
  }, [viewMode, onDayClick])

  // Animationsvarianten für View-Wechsel
  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          variants={viewVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' && (
            <MonthView
              tripId={tripId}
              currentDate={currentDate}
              startDate={tripStartDate}
              endDate={tripEndDate}
              onDayClick={handleDayClick}
            />
          )}

          {viewMode === 'week' && (
            <WeekView
              tripId={tripId}
              currentDate={currentDate}
              startDate={tripStartDate}
              endDate={tripEndDate}
              onActivityClick={onActivityClick}
              showHours={false}
            />
          )}

          {viewMode === 'timeline' && (
            <TimelineView
              tripId={tripId}
              currentDate={currentDate}
              onActivityClick={onActivityClick}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
