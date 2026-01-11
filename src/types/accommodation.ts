export interface Accommodation {
  id: string
  tripId: string
  destinationId?: string
  name: string
  type: AccommodationType
  address: string
  checkIn: string
  checkOut: string
  confirmationNumber?: string
  price: number
  currency: string
  isPaid: boolean
  contactInfo?: {
    phone?: string
    email?: string
    website?: string
  }
  notes?: string
  amenities?: string[]
}

export type AccommodationType =
  | 'hotel'
  | 'airbnb'
  | 'hostel'
  | 'apartment'
  | 'camping'
  | 'other'
