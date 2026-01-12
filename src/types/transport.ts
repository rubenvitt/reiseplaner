export type TransportMode =
  | 'car'
  | 'train'
  | 'flight'
  | 'bus'
  | 'ferry'
  | 'taxi'
  | 'walking'
  | 'bicycle'
  | 'other'

export interface TransportLocation {
  destinationId?: string
  name: string
  address?: string
}

export interface TransportDetails {
  // Flug
  flightNumber?: string
  airline?: string
  terminal?: string
  gate?: string
  // Zug
  trainNumber?: string
  carrier?: string
  wagon?: string
  seat?: string
  platform?: string
  // Auto
  vehicleInfo?: string
  licensePlate?: string
}

export interface Transport {
  id: string
  tripId: string
  mode: TransportMode

  origin: TransportLocation
  destination: TransportLocation

  departureDate: string
  departureTime?: string
  arrivalDate: string
  arrivalTime?: string

  bookingReference?: string
  price?: number
  currency: string
  isPaid: boolean

  details?: TransportDetails
  notes?: string
}
