import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, MapPin, Pencil } from 'lucide-react'
import { useTripStore } from '@/stores'
import { DestinationCard, DestinationForm } from '@/components/destinations'
import type { DestinationFormData } from '@/components/destinations'
import { TripForm, type TripFormData } from '@/components/trips'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDateRangeOrPlaceholder } from '@/lib/utils'
import type { Destination } from '@/types'

export function TripOverview() {
  const { tripId } = useParams<{ tripId: string }>()
  const trip = useTripStore((state) => state.getTrip(tripId || ''))
  const updateTrip = useTripStore((state) => state.updateTrip)
  const addDestination = useTripStore((state) => state.addDestination)
  const updateDestination = useTripStore((state) => state.updateDestination)
  const deleteDestination = useTripStore((state) => state.deleteDestination)

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null)

  if (!trip) {
    return null
  }

  // Handlers
  const handleAddDestination = (data: DestinationFormData) => {
    if (!tripId) return

    addDestination(tripId, {
      name: data.name,
      country: data.country,
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
      notes: data.notes,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDestination = (data: DestinationFormData) => {
    if (!tripId || !editingDestination) return

    updateDestination(tripId, editingDestination.id, {
      name: data.name,
      country: data.country,
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
      notes: data.notes,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setEditingDestination(null)
  }

  const handleEditTrip = (data: TripFormData) => {
    if (!tripId) return
    updateTrip(tripId, data)
    setIsEditDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!tripId || !deletingDestination) return
    deleteDestination(tripId, deletingDestination.id)
    setDeletingDestination(null)
  }

  const sortedDestinations = [...trip.destinations].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Trip Info Card */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Reiseübersicht</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Basisdaten bearbeiten
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Reisezeitraum</p>
            <p className="text-foreground">
              {formatDateRangeOrPlaceholder(trip.startDate, trip.endDate)}
            </p>
          </div>

          {trip.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Beschreibung</p>
              <p className="text-foreground">{trip.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Destinations */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Reiseziele</h2>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Reiseziel hinzufügen
          </Button>
        </div>

        {sortedDestinations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Keine Reiseziele vorhanden
            </p>
            <p className="text-muted-foreground/70 mb-4">
              Füge dein erstes Reiseziel für diese Reise hinzu.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Reiseziel hinzufügen
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {sortedDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                onEdit={() => setEditingDestination(destination)}
                onDelete={() => setDeletingDestination(destination)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reise Basisdaten bearbeiten</DialogTitle>
          </DialogHeader>
          <TripForm
            trip={trip}
            onSubmit={handleEditTrip}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neues Reiseziel</DialogTitle>
          </DialogHeader>
          <DestinationForm
            onSubmit={handleAddDestination}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingDestination !== null}
        onOpenChange={(open) => !open && setEditingDestination(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reiseziel bearbeiten</DialogTitle>
          </DialogHeader>
          {editingDestination && (
            <DestinationForm
              destination={editingDestination}
              onSubmit={handleEditDestination}
              onCancel={() => setEditingDestination(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingDestination !== null}
        onOpenChange={(open) => !open && setDeletingDestination(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reiseziel löschen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Möchtest du das Reiseziel "{deletingDestination?.name}" wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingDestination(null)}
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
