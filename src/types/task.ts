export type TaskStatus = 'open' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskCategory = 'booking' | 'documents' | 'packing' | 'finance' | 'health' | 'other'

export interface Task {
  id: string
  tripId: string
  title: string
  description?: string
  deadline?: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  createdAt: string
  completedAt?: string
}

export const taskCategoryLabels: Record<TaskCategory, string> = {
  booking: 'Buchung',
  documents: 'Dokumente',
  packing: 'Packen',
  finance: 'Finanzen',
  health: 'Gesundheit',
  other: 'Sonstiges',
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
}
