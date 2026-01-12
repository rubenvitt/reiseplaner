import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transport } from '@/types'

interface TransportState {
  transports: Transport[]

  // CRUD operations
  addTransport: (transport: Omit<Transport, 'id'>) => string
  updateTransport: (id: string, updates: Partial<Omit<Transport, 'id'>>) => void
  deleteTransport: (id: string) => void
  getTransport: (id: string) => Transport | undefined
  getTransportsByTrip: (tripId: string) => Transport[]
  getTransportsByDate: (tripId: string, date: string) => Transport[]
  getTotalTransportCost: (tripId: string) => number
  togglePaidStatus: (id: string) => void
}

export const useTransportStore = create<TransportState>()(
  persist(
    (set, get) => ({
      transports: [],

      addTransport: (transportData) => {
        const id = crypto.randomUUID()
        const newTransport: Transport = {
          ...transportData,
          id,
        }
        set((state) => ({
          transports: [...state.transports, newTransport],
        }))
        return id
      },

      updateTransport: (id, updates) => {
        set((state) => ({
          transports: state.transports.map((transport) =>
            transport.id === id ? { ...transport, ...updates } : transport
          ),
        }))
      },

      deleteTransport: (id) => {
        set((state) => ({
          transports: state.transports.filter((transport) => transport.id !== id),
        }))
      },

      getTransport: (id) => {
        return get().transports.find((transport) => transport.id === id)
      },

      getTransportsByTrip: (tripId) => {
        return get()
          .transports.filter((transport) => transport.tripId === tripId)
          .sort((a, b) => {
            const dateA = new Date(`${a.departureDate}T${a.departureTime || '00:00'}`)
            const dateB = new Date(`${b.departureDate}T${b.departureTime || '00:00'}`)
            return dateA.getTime() - dateB.getTime()
          })
      },

      getTransportsByDate: (tripId, date) => {
        return get()
          .transports.filter(
            (transport) => transport.tripId === tripId && transport.departureDate === date
          )
          .sort((a, b) => {
            const timeA = a.departureTime || '00:00'
            const timeB = b.departureTime || '00:00'
            return timeA.localeCompare(timeB)
          })
      },

      getTotalTransportCost: (tripId) => {
        return get()
          .transports.filter((transport) => transport.tripId === tripId && transport.price)
          .reduce((sum, transport) => sum + (transport.price || 0), 0)
      },

      togglePaidStatus: (id) => {
        set((state) => ({
          transports: state.transports.map((transport) =>
            transport.id === id ? { ...transport, isPaid: !transport.isPaid } : transport
          ),
        }))
      },
    }),
    {
      name: 'reiseplaner-transports',
    }
  )
)
