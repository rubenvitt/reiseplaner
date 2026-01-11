export interface PackingList {
  id: string
  tripId: string
  name: string
  categories: PackingCategory[]
  createdAt: string
  updatedAt: string
}

export interface PackingCategory {
  id: string
  listId: string
  name: string
  icon?: string
  order: number
  items: PackingItem[]
}

export interface PackingItem {
  id: string
  categoryId: string
  name: string
  quantity: number
  isPacked: boolean
  isEssential: boolean
  notes?: string
  order: number
}
