import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Building2 } from 'lucide-react'
import { useTripStore, useAccommodationStore } from '@/stores'
import { AccommodationCard, AccommodationForm } from '@/components/accommodations'
import type { AccommodationFormData } from '@/components/accommodations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Accommodation } from '@/types'

export function AccommodationsPage() {
  const { tripId } = useParams<{ tripId: string }>()

  // Stores
  const getTrip = useTripStore((state) => state.getTrip)
  const trip = tripId ? getTrip(tripId) : undefined

  const getAccommodationsByTrip = useAccommodationStore((state) => state.getAccommodationsByTrip)
  const addAccommodation = useAccommodationStore((state) => state.addAccommodation)
  const updateAccommodation = useAccommodationStore((state) => state.updateAccommodation)
  const deleteAccommodation = useAccommodationStore((state) => state.deleteAccommodation)
  const togglePaidStatus = useAccommodationStore((state) => state.togglePaidStatus)

  const getAccommodationsByDestination = useAccommodationStore((state) => state.getAccommodationsByDestination)

  // Filter State
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | 'all'>('all')

  // Gefilterte Unterkünfte
  const allAccommodations = tripId ? getAccommodationsByTrip(tripId) : []
  const accommodations = selectedDestinationId === 'all'
    ? allAccommodations
    : selectedDestinationId === 'none'
      ? allAccommodations.filter((a) => !a.destinationId)
      : getAccommodationsByDestination(selectedDestinationId)

  // Destinations aus dem Trip
  const destinations = trip?.destinations ?? []

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null)
  const [deletingAccommodation, setDeletingAccommodation] = useState<Accommodation | null>(null)

  // Handlers
  const handleAddAccommodation = (data: AccommodationFormData) => {
    if (!tripId) return

    addAccommodation({
      tripId,
      destinationId: data.destinationId,
      name: data.name,
      type: data.type,
      address: data.address,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      price: data.price,
      currency: data.currency,
      isPaid: data.isPaid,
      confirmationNumber: data.confirmationNumber,
      contactInfo: {
        phone: data.phone,
        email: data.email,
        website: data.website,
      },
      notes: data.notes,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditAccommodation = (data: AccommodationFormData) => {
    if (!editingAccommodation) return

    updateAccommodation(editingAccommodation.id, {
      destinationId: data.destinationId,
      name: data.name,
      type: data.type,
      address: data.address,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      price: data.price,
      currency: data.currency,
      isPaid: data.isPaid,
      confirmationNumber: data.confirmationNumber,
      contactInfo: {
        phone: data.phone,
        email: data.email,
        website: data.website,
      },
      notes: data.notes,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setEditingAccommodation(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingAccommodation) return
    deleteAccommodation(deletingAccommodation.id)
    setDeletingAccommodation(null)
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
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to={`/trip/${tripId}`}
          className="text-primary hover:underline text-sm"
        >
          ← Zurück zur Reise
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Unterkünfte
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Unterkunft hinzufügen
        </Button>
      </div>

      {/* Filter Buttons */}
      {destinations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedDestinationId === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDestinationId('all')}
          >
            Alle
          </Button>
          <Button
            variant={selectedDestinationId === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDestinationId('none')}
          >
            Ohne Reiseziel
          </Button>
          {destinations.map((destination) => (
            <Button
              key={destination.id}
              variant={selectedDestinationId === destination.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDestinationId(destination.id)}
            >
              {destination.name}
            </Button>
          ))}
        </div>
      )}

      {/* Accommodation List or Empty State */}
      {accommodations.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">Keine Unterkünfte vorhanden</p>
            <p className="mb-4">Füge deine erste Unterkunft für diese Reise hinzu.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Unterkunft hinzufügen
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {accommodations.map((accommodation) => {
            const destination = destinations.find((d) => d.id === accommodation.destinationId)
            return (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodation}
                destinationName={destination?.name}
                onEdit={() => setEditingAccommodation(accommodation)}
                onDelete={() => setDeletingAccommodation(accommodation)}
                onTogglePaid={() => handleTogglePaid(accommodation.id)}
              />
            )
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neue Unterkunft</DialogTitle>
          </DialogHeader>
          <AccommodationForm
            tripId={tripId!}
            onSubmit={handleAddAccommodation}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingAccommodation !== null}
        onOpenChange={(open) => !open && setEditingAccommodation(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unterkunft bearbeiten</DialogTitle>
          </DialogHeader>
          {editingAccommodation && (
            <AccommodationForm
              tripId={tripId!}
              accommodation={editingAccommodation}
              onSubmit={handleEditAccommodation}
              onCancel={() => setEditingAccommodation(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingAccommodation !== null}
        onOpenChange={(open) => !open && setDeletingAccommodation(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unterkunft löschen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Möchtest du die Unterkunft "{deletingAccommodation?.name}" wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingAccommodation(null)}
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
