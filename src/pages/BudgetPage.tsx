import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Wallet } from 'lucide-react'
import { useTripStore, useBudgetStore } from '@/stores'
import { BudgetOverview, ExpenseCard, ExpenseForm, type ExpenseFormData } from '@/components/budget'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/types'

export function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const getTrip = useTripStore((state) => state.getTrip)
  const { getExpensesByTrip, addExpense, updateExpense, deleteExpense } = useBudgetStore()

  const trip = tripId ? getTrip(tripId) : undefined
  const expenses = tripId ? getExpensesByTrip(tripId) : []

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  const handleAddExpense = (data: ExpenseFormData) => {
    addExpense({
      tripId: data.tripId,
      title: data.title,
      amount: data.amount,
      currency: data.currency,
      category: data.category,
      date: data.date,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      isReimbursable: data.isReimbursable,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditExpense = (data: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: data.title,
        amount: data.amount,
        currency: data.currency,
        category: data.category,
        date: data.date,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        isReimbursable: data.isReimbursable,
      })
      setEditingExpense(null)
    }
  }

  const handleConfirmDelete = () => {
    if (deletingExpense) {
      deleteExpense(deletingExpense.id)
      setDeletingExpense(null)
    }
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <p>Reise nicht gefunden.</p>
          <Link to="/trips" className="text-primary hover:underline">
            Zurueck zur Uebersicht
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
          ← Zurueck zur Reise
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Budget - {trip.name}
      </h1>

      {/* Budget Overview - Full Width */}
      <div className="mb-8">
        <BudgetOverview
          totalBudget={trip.totalBudget}
          currency={trip.currency}
          tripId={tripId!}
        />
      </div>

      {/* Expenses Section */}
      <div className="space-y-4">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Ausgaben</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ausgabe hinzufuegen
          </Button>
        </div>

        {/* Expense List or Empty State */}
        {expenses.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="text-center text-muted-foreground">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Keine Ausgaben vorhanden</p>
              <p className="mb-4">
                Fuege deine erste Ausgabe hinzu, um den Ueberblick ueber dein Budget zu behalten.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Erste Ausgabe hinzufuegen
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currency={trip.currency}
                onEdit={() => setEditingExpense(expense)}
                onDelete={() => setDeletingExpense(expense)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Ausgabe</DialogTitle>
            <DialogDescription>
              Erfasse eine neue Ausgabe fuer diese Reise.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            tripId={tripId!}
            currency={trip.currency}
            onSubmit={handleAddExpense}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog
        open={editingExpense !== null}
        onOpenChange={(open) => !open && setEditingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ausgabe bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Details dieser Ausgabe.
            </DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              tripId={tripId!}
              currency={trip.currency}
              expense={editingExpense}
              onSubmit={handleEditExpense}
              onCancel={() => setEditingExpense(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingExpense !== null}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ausgabe loeschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du die Ausgabe "{deletingExpense?.title}" loeschen moechtest?
              Diese Aktion kann nicht rueckgaengig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingExpense(null)}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Loeschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
