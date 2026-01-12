export interface Trip {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  coverImage?: string
  destinations: Destination[]
  status: TripStatus
  currency: string
  totalBudget: number
  createdAt: string
  updatedAt: string
}

export interface Destination {
  id: string
  tripId: string
  name: string
  country: string
  arrivalDate: string
  departureDate: string
  order: number
  notes?: string
  latitude?: number
  longitude?: number
}

export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed'
