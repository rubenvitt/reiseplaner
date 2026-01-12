export interface DayPlan {
  id: string
  tripId: string
  date: string
  destinationId?: string
  activities: Activity[]
  notes?: string
}

export interface Activity {
  id: string
  dayId: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  location?: string
  category: ActivityCategory
  order: number
  isCompleted: boolean
  cost?: number
  bookingReference?: string
  latitude?: number
  longitude?: number
}

export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'activity'
  | 'relaxation'
  | 'shopping'
  | 'other'
