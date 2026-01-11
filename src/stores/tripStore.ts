import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, Destination } from '@/types'

interface TripState {
  trips: Trip[]
  currentTripId: string | null

  // Trip CRUD
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'destinations'>) => string
  updateTrip: (id: string, updates: Partial<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteTrip: (id: string) => void
  getTrip: (id: string) => Trip | undefined
  setCurrentTrip: (id: string | null) => void

  // Destination CRUD
  addDestination: (tripId: string, destination: Omit<Destination, 'id' | 'tripId' | 'order'>) => string
  updateDestination: (tripId: string, destinationId: string, updates: Partial<Omit<Destination, 'id' | 'tripId'>>) => void
  deleteDestination: (tripId: string, destinationId: string) => void
  reorderDestinations: (tripId: string, destinationIds: string[]) => void
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      currentTripId: null,

      // Trip CRUD
      addTrip: (tripData) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const newTrip: Trip = {
          ...tripData,
          id,
          destinations: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          trips: [...state.trips, newTrip],
        }))
        return id
      },

      updateTrip: (id, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id
              ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
              : trip
          ),
        }))
      },

      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
          currentTripId: state.currentTripId === id ? null : state.currentTripId,
        }))
      },

      getTrip: (id) => {
        return get().trips.find((trip) => trip.id === id)
      },

      setCurrentTrip: (id) => {
        set({ currentTripId: id })
      },

      // Destination CRUD
      addDestination: (tripId, destinationData) => {
        const id = crypto.randomUUID()
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip
            const newDestination: Destination = {
              ...destinationData,
              id,
              tripId,
              order: trip.destinations.length,
            }
            return {
              ...trip,
              destinations: [...trip.destinations, newDestination],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
        return id
      },

      updateDestination: (tripId, destinationId, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip
            return {
              ...trip,
              destinations: trip.destinations.map((dest) =>
                dest.id === destinationId ? { ...dest, ...updates } : dest
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteDestination: (tripId, destinationId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip
            const filteredDestinations = trip.destinations
              .filter((dest) => dest.id !== destinationId)
              .map((dest, index) => ({ ...dest, order: index }))
            return {
              ...trip,
              destinations: filteredDestinations,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      reorderDestinations: (tripId, destinationIds) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip
            const reorderedDestinations = destinationIds
              .map((id, index) => {
                const dest = trip.destinations.find((d) => d.id === id)
                return dest ? { ...dest, order: index } : null
              })
              .filter((dest): dest is Destination => dest !== null)
            return {
              ...trip,
              destinations: reorderedDestinations,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },
    }),
    {
      name: 'reiseplaner-trips',
    }
  )
)
