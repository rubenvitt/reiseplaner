import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, ExpenseCategory } from '@/types'

interface BudgetState {
  expenses: Expense[]

  // CRUD operations
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => string
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void
  deleteExpense: (id: string) => void
  getExpense: (id: string) => Expense | undefined

  // Selectors
  getExpensesByTrip: (tripId: string) => Expense[]
  getExpensesByCategory: (tripId: string, category: ExpenseCategory) => Expense[]
  getExpensesByDate: (tripId: string, date: string) => Expense[]
  getTotalSpent: (tripId: string) => number
  getTotalSpentByCategory: (tripId: string, category: ExpenseCategory) => number
  getReimbursableExpenses: (tripId: string) => Expense[]
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      expenses: [],

      addExpense: (expenseData) => {
        const id = crypto.randomUUID()
        const newExpense: Expense = {
          ...expenseData,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }))
        return id
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates } : expense
          ),
        }))
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }))
      },

      getExpense: (id) => {
        return get().expenses.find((expense) => expense.id === id)
      },

      // Selectors
      getExpensesByTrip: (tripId) => {
        return get()
          .expenses.filter((expense) => expense.tripId === tripId)
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.date && !b.date) return 0
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
      },

      getExpensesByCategory: (tripId, category) => {
        return get()
          .expenses.filter(
            (expense) => expense.tripId === tripId && expense.category === category
          )
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.date && !b.date) return 0
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
      },

      getExpensesByDate: (tripId, date) => {
        return get()
          .expenses.filter(
            (expense) => expense.tripId === tripId && expense.date === date
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getTotalSpent: (tripId) => {
        return get()
          .expenses.filter((expense) => expense.tripId === tripId)
          .reduce((total, expense) => total + expense.amount, 0)
      },

      getTotalSpentByCategory: (tripId, category) => {
        return get()
          .expenses.filter(
            (expense) => expense.tripId === tripId && expense.category === category
          )
          .reduce((total, expense) => total + expense.amount, 0)
      },

      getReimbursableExpenses: (tripId) => {
        return get()
          .expenses.filter(
            (expense) => expense.tripId === tripId && expense.isReimbursable
          )
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.date && !b.date) return 0
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
      },
    }),
    {
      name: 'reiseplaner-budget',
    }
  )
)
