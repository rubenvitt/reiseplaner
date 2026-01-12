import { useState } from 'react'
import { Settings, Database, Trash2, Info, Palette } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ThemeToggle,
} from '@/components/ui'
import { ExportImport } from '@/components/shared'
import {
  useTripStore,
  useItineraryStore,
  useAccommodationStore,
  useBudgetStore,
  usePackingStore,
} from '@/stores'

export function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAllData = () => {
    if (deleteConfirmation !== 'LOESCHEN') return

    setIsDeleting(true)

    // Clear all stores
    const tripState = useTripStore.getState()
    const itineraryState = useItineraryStore.getState()
    const accommodationState = useAccommodationStore.getState()
    const budgetState = useBudgetStore.getState()
    const packingState = usePackingStore.getState()

    // Delete all trips
    tripState.trips.forEach((trip) => tripState.deleteTrip(trip.id))

    // Delete all day plans
    itineraryState.dayPlans.forEach((dp) => itineraryState.deleteDayPlan(dp.id))

    // Delete all accommodations
    accommodationState.accommodations.forEach((a) =>
      accommodationState.deleteAccommodation(a.id)
    )

    // Delete all expenses
    budgetState.expenses.forEach((e) => budgetState.deleteExpense(e.id))

    // Delete all packing lists
    packingState.packingLists.forEach((pl) => packingState.deletePackingList(pl.id))

    // Also clear localStorage
    localStorage.removeItem('reiseplaner-trips')
    localStorage.removeItem('reiseplaner-itinerary')
    localStorage.removeItem('reiseplaner-accommodations')
    localStorage.removeItem('reiseplaner-budget')
    localStorage.removeItem('reiseplaner-packing')

    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
    setDeleteConfirmation('')
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
    setDeleteConfirmation('')
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        </div>

        <div className="space-y-6">
          {/* Erscheinungsbild Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Erscheinungsbild</CardTitle>
              </div>
              <CardDescription>
                Passe das Aussehen der App an deine Vorlieben an.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Farbschema</p>
                  <p className="text-sm text-muted-foreground">
                    Wähle zwischen hellem, dunklem oder System-Modus.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Daten verwalten Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Daten verwalten</CardTitle>
              </div>
              <CardDescription>
                Exportiere oder importiere deine Reisedaten und verwalte den Speicher.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export/Import */}
              <ExportImport />

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Delete all data */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Gefahrenzone</h3>
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Alle Daten löschen</p>
                      <p className="text-sm text-destructive/80 mt-1">
                        Diese Aktion löscht alle Reisen, Unterkünfte, Ausgaben und Packlisten
                        unwiderruflich. Erstelle vorher ein Backup, wenn du deine Daten behalten
                        möchtest.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Alle Daten löschen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Über die App Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Über die App</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <svg
                    className="h-8 w-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Reiseplaner</h2>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Der Reiseplaner hilft dir, deine Reisen zu organisieren. Plane Routen, verwalte
                Unterkünfte, behalte dein Budget im Blick und erstelle Packlisten - alles an einem
                Ort. Deine Daten werden lokal auf deinem Gerät gespeichert.
              </p>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground/70">
                  Mit Liebe entwickelt. Alle Daten werden lokal in deinem Browser gespeichert.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Alle Daten löschen?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Reisen,
              Unterkünfte, Ausgaben und Packlisten werden unwiderruflich gelöscht.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Gib <span className="font-mono font-bold">LOESCHEN</span> ein, um zu
                bestätigen.
              </p>
            </div>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="LOESCHEN"
              className="font-mono"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllData}
              disabled={deleteConfirmation !== 'LOESCHEN' || isDeleting}
            >
              {isDeleting ? 'Wird gelöscht...' : 'Endgültig löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
