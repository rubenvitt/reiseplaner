import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Route } from 'lucide-react'
import { useTripStore, useTransportStore } from '@/stores'
import { TransportCard, TransportForm } from '@/components/transport'
import type { TransportFormData } from '@/components/transport'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Transport } from '@/types'

export function TransportPage() {
  const { tripId } = useParams<{ tripId: string }>()

  // Stores
  const getTrip = useTripStore((state) => state.getTrip)
  const trip = tripId ? getTrip(tripId) : undefined

  const getTransportsByTrip = useTransportStore((state) => state.getTransportsByTrip)
  const addTransport = useTransportStore((state) => state.addTransport)
  const updateTransport = useTransportStore((state) => state.updateTransport)
  const deleteTransport = useTransportStore((state) => state.deleteTransport)
  const togglePaidStatus = useTransportStore((state) => state.togglePaidStatus)

  const transports = tripId ? getTransportsByTrip(tripId) : []
  const destinations = trip?.destinations || []

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null)
  const [deletingTransport, setDeletingTransport] = useState<Transport | null>(null)

  // Helpers
  const getDestinationName = (destinationId: string | undefined): string | undefined => {
    if (!destinationId) return undefined
    const dest = destinations.find((d) => d.id === destinationId)
    return dest ? `${dest.name}, ${dest.country}` : undefined
  }

  // Handlers
  const handleAddTransport = (data: TransportFormData) => {
    if (!tripId) return

    const originName = data.originDestinationId
      ? getDestinationName(data.originDestinationId) || data.originName
      : data.originName

    const destinationName = data.destinationDestinationId
      ? getDestinationName(data.destinationDestinationId) || data.destinationName
      : data.destinationName

    addTransport({
      tripId,
      mode: data.mode,
      origin: {
        destinationId: data.originDestinationId || undefined,
        name: originName,
      },
      destination: {
        destinationId: data.destinationDestinationId || undefined,
        name: destinationName,
      },
      departureDate: data.departureDate,
      departureTime: data.departureTime || undefined,
      arrivalDate: data.arrivalDate,
      arrivalTime: data.arrivalTime || undefined,
      bookingReference: data.bookingReference || undefined,
      price: data.price || undefined,
      currency: data.currency,
      isPaid: data.isPaid,
      details: {
        flightNumber: data.flightNumber || undefined,
        airline: data.airline || undefined,
        terminal: data.terminal || undefined,
        gate: data.gate || undefined,
        trainNumber: data.trainNumber || undefined,
        carrier: data.carrier || undefined,
        wagon: data.wagon || undefined,
        seat: data.seat || undefined,
        platform: data.platform || undefined,
        vehicleInfo: data.vehicleInfo || undefined,
        licensePlate: data.licensePlate || undefined,
      },
      notes: data.notes || undefined,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTransport = (data: TransportFormData) => {
    if (!editingTransport) return

    const originName = data.originDestinationId
      ? getDestinationName(data.originDestinationId) || data.originName
      : data.originName

    const destinationName = data.destinationDestinationId
      ? getDestinationName(data.destinationDestinationId) || data.destinationName
      : data.destinationName

    updateTransport(editingTransport.id, {
      mode: data.mode,
      origin: {
        destinationId: data.originDestinationId || undefined,
        name: originName,
      },
      destination: {
        destinationId: data.destinationDestinationId || undefined,
        name: destinationName,
      },
      departureDate: data.departureDate,
      departureTime: data.departureTime || undefined,
      arrivalDate: data.arrivalDate,
      arrivalTime: data.arrivalTime || undefined,
      bookingReference: data.bookingReference || undefined,
      price: data.price || undefined,
      currency: data.currency,
      isPaid: data.isPaid,
      details: {
        flightNumber: data.flightNumber || undefined,
        airline: data.airline || undefined,
        terminal: data.terminal || undefined,
        gate: data.gate || undefined,
        trainNumber: data.trainNumber || undefined,
        carrier: data.carrier || undefined,
        wagon: data.wagon || undefined,
        seat: data.seat || undefined,
        platform: data.platform || undefined,
        vehicleInfo: data.vehicleInfo || undefined,
        licensePlate: data.licensePlate || undefined,
      },
      notes: data.notes || undefined,
    })
    setEditingTransport(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingTransport) return
    deleteTransport(deletingTransport.id)
    setDeletingTransport(null)
  }

  const handleTogglePaid = (id: string) => {
    togglePaidStatus(id)
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Reise nicht gefunden</h1>
          <Link to="/" className="text-primary hover:underline">
            Zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Transport
        </h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Transport hinzufügen
        </Button>
      </div>

      {/* Transport List or Empty State */}
      {transports.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8">
          <div className="text-center text-muted-foreground">
            <Route className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">Keine Transporte vorhanden</p>
            <p className="mb-4">Füge deine erste Fahrt oder Flug für diese Reise hinzu.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Transport hinzufügen
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {transports.map((transport) => (
            <TransportCard
              key={transport.id}
              transport={transport}
              onEdit={() => setEditingTransport(transport)}
              onDelete={() => setDeletingTransport(transport)}
              onTogglePaid={() => handleTogglePaid(transport.id)}
            />
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neuer Transport</DialogTitle>
          </DialogHeader>
          <TransportForm
            tripId={tripId!}
            destinations={destinations}
            onSubmit={handleAddTransport}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingTransport !== null}
        onOpenChange={(open) => !open && setEditingTransport(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transport bearbeiten</DialogTitle>
          </DialogHeader>
          {editingTransport && (
            <TransportForm
              tripId={tripId!}
              transport={editingTransport}
              destinations={destinations}
              onSubmit={handleEditTransport}
              onCancel={() => setEditingTransport(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingTransport !== null}
        onOpenChange={(open) => !open && setDeletingTransport(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transport löschen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Möchtest du den Transport von "{deletingTransport?.origin.name}" nach "{deletingTransport?.destination.name}" wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingTransport(null)}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Löschen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
