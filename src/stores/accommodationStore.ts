import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Accommodation } from '@/types'

interface AccommodationState {
  accommodations: Accommodation[]

  // CRUD operations
  addAccommodation: (accommodation: Omit<Accommodation, 'id'>) => string
  updateAccommodation: (id: string, updates: Partial<Omit<Accommodation, 'id'>>) => void
  deleteAccommodation: (id: string) => void
  getAccommodation: (id: string) => Accommodation | undefined
  getAccommodationsByTrip: (tripId: string) => Accommodation[]
  getAccommodationsByDestination: (destinationId: string) => Accommodation[]
  togglePaidStatus: (id: string) => void
}

export const useAccommodationStore = create<AccommodationState>()(
  persist(
    (set, get) => ({
      accommodations: [],

      addAccommodation: (accommodationData) => {
        const id = crypto.randomUUID()
        const newAccommodation: Accommodation = {
          ...accommodationData,
          id,
        }
        set((state) => ({
          accommodations: [...state.accommodations, newAccommodation],
        }))
        return id
      },

      updateAccommodation: (id, updates) => {
        set((state) => ({
          accommodations: state.accommodations.map((accommodation) =>
            accommodation.id === id ? { ...accommodation, ...updates } : accommodation
          ),
        }))
      },

      deleteAccommodation: (id) => {
        set((state) => ({
          accommodations: state.accommodations.filter(
            (accommodation) => accommodation.id !== id
          ),
        }))
      },

      getAccommodation: (id) => {
        return get().accommodations.find((accommodation) => accommodation.id === id)
      },

      getAccommodationsByTrip: (tripId) => {
        return get()
          .accommodations.filter((accommodation) => accommodation.tripId === tripId)
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.checkIn && !b.checkIn) return 0
            if (!a.checkIn) return 1
            if (!b.checkIn) return -1
            return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
          })
      },

      getAccommodationsByDestination: (destinationId) => {
        return get()
          .accommodations.filter(
            (accommodation) => accommodation.destinationId === destinationId
          )
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.checkIn && !b.checkIn) return 0
            if (!a.checkIn) return 1
            if (!b.checkIn) return -1
            return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
          })
      },

      togglePaidStatus: (id) => {
        set((state) => ({
          accommodations: state.accommodations.map((accommodation) =>
            accommodation.id === id
              ? { ...accommodation, isPaid: !accommodation.isPaid }
              : accommodation
          ),
        }))
      },
    }),
    {
      name: 'reiseplaner-accommodations',
    }
  )
)
