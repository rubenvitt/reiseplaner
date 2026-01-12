import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTripStore } from '@/stores'
import { TripCard, TripForm, type TripFormData } from '@/components/trips'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { StaggerList, StaggerItem, FadeIn } from '@/components/ui/motion'

export function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const trips = useTripStore((state) => state.trips)
  const addTrip = useTripStore((state) => state.addTrip)
  const deleteTrip = useTripStore((state) => state.deleteTrip)

  const handleCreateTrip = (data: TripFormData) => {
    addTrip({
      ...data,
      status: 'planning',
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteTrip = () => {
    if (deleteConfirmId) {
      deleteTrip(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const tripToDelete = deleteConfirmId
    ? trips.find((t) => t.id === deleteConfirmId)
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Meine Reisen</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          data-tour="create-trip"
        >
          <Plus className="w-5 h-5 mr-2" />
          Neue Reise
        </Button>
      </div>

      {trips.length === 0 ? (
        <FadeIn direction="up">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">
              Noch keine Reisen. Erstelle deine erste Reise!
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Erste Reise erstellen
            </Button>
          </div>
        </FadeIn>
      ) : (
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <StaggerItem
              key={trip.id}
              {...(index === 0 && { 'data-tour': 'trip-card' })}
            >
              <TripCard
                trip={trip}
                onDelete={() => setDeleteConfirmId(trip.id)}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      {/* Create Trip Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neue Reise erstellen</DialogTitle>
          </DialogHeader>
          <TripForm
            onSubmit={handleCreateTrip}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reise löschen</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Bist du sicher, dass du die Reise "{tripToDelete?.name}" löschen
            möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              Löschen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
