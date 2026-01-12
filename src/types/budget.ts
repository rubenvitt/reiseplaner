export interface Budget {
  tripId: string
  totalBudget: number
  currency: string
  categories: BudgetCategory[]
}

export interface BudgetCategory {
  id: string
  name: ExpenseCategory
  allocatedAmount: number
  color: string
}

export interface Expense {
  id: string
  tripId: string
  dayId?: string
  title: string
  amount: number
  currency: string
  category: ExpenseCategory
  date?: string
  paymentMethod?: PaymentMethod
  notes?: string
  isReimbursable: boolean
  createdAt: string
}

export type ExpenseCategory =
  | 'accommodation'
  | 'transport'
  | 'food'
  | 'activities'
  | 'shopping'
  | 'insurance'
  | 'visa'
  | 'other'

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'other'
