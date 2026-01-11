import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PackingList, PackingCategory, PackingItem } from '@/types'

interface PackingState {
  packingLists: PackingList[]

  // PackingList CRUD
  addPackingList: (list: Omit<PackingList, 'id' | 'categories' | 'createdAt' | 'updatedAt'>) => string
  updatePackingList: (id: string, updates: Partial<Omit<PackingList, 'id' | 'categories' | 'createdAt' | 'updatedAt'>>) => void
  deletePackingList: (id: string) => void
  getPackingList: (id: string) => PackingList | undefined
  getPackingListsByTrip: (tripId: string) => PackingList[]

  // Category CRUD
  addCategory: (listId: string, category: Omit<PackingCategory, 'id' | 'listId' | 'items' | 'order'>) => string
  updateCategory: (listId: string, categoryId: string, updates: Partial<Omit<PackingCategory, 'id' | 'listId' | 'items'>>) => void
  deleteCategory: (listId: string, categoryId: string) => void
  reorderCategories: (listId: string, categoryIds: string[]) => void

  // Item CRUD
  addItem: (listId: string, categoryId: string, item: Omit<PackingItem, 'id' | 'categoryId' | 'order'>) => string
  updateItem: (listId: string, categoryId: string, itemId: string, updates: Partial<Omit<PackingItem, 'id' | 'categoryId'>>) => void
  deleteItem: (listId: string, categoryId: string, itemId: string) => void
  toggleItemPacked: (listId: string, categoryId: string, itemId: string) => void
  reorderItems: (listId: string, categoryId: string, itemIds: string[]) => void
  moveItemToCategory: (listId: string, fromCategoryId: string, toCategoryId: string, itemId: string) => void

  // Utility selectors
  getPackedItemsCount: (listId: string) => { packed: number; total: number }
  getEssentialItems: (listId: string) => PackingItem[]
}

export const usePackingStore = create<PackingState>()(
  persist(
    (set, get) => ({
      packingLists: [],

      // PackingList CRUD
      addPackingList: (listData) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const newList: PackingList = {
          ...listData,
          id,
          categories: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          packingLists: [...state.packingLists, newList],
        }))
        return id
      },

      updatePackingList: (id, updates) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) =>
            list.id === id
              ? { ...list, ...updates, updatedAt: new Date().toISOString() }
              : list
          ),
        }))
      },

      deletePackingList: (id) => {
        set((state) => ({
          packingLists: state.packingLists.filter((list) => list.id !== id),
        }))
      },

      getPackingList: (id) => {
        return get().packingLists.find((list) => list.id === id)
      },

      getPackingListsByTrip: (tripId) => {
        return get().packingLists.filter((list) => list.tripId === tripId)
      },

      // Category CRUD
      addCategory: (listId, categoryData) => {
        const id = crypto.randomUUID()
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            const newCategory: PackingCategory = {
              ...categoryData,
              id,
              listId,
              items: [],
              order: list.categories.length,
            }
            return {
              ...list,
              categories: [...list.categories, newCategory],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
        return id
      },

      updateCategory: (listId, categoryId, updates) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) =>
                category.id === categoryId ? { ...category, ...updates } : category
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteCategory: (listId, categoryId) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            const filteredCategories = list.categories
              .filter((category) => category.id !== categoryId)
              .map((category, index) => ({ ...category, order: index }))
            return {
              ...list,
              categories: filteredCategories,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      reorderCategories: (listId, categoryIds) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            const reorderedCategories = categoryIds
              .map((id, index) => {
                const category = list.categories.find((c) => c.id === id)
                return category ? { ...category, order: index } : null
              })
              .filter((category): category is PackingCategory => category !== null)
            return {
              ...list,
              categories: reorderedCategories,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      // Item CRUD
      addItem: (listId, categoryId, itemData) => {
        const id = crypto.randomUUID()
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) => {
                if (category.id !== categoryId) return category
                const newItem: PackingItem = {
                  ...itemData,
                  id,
                  categoryId,
                  order: category.items.length,
                }
                return {
                  ...category,
                  items: [...category.items, newItem],
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
        return id
      },

      updateItem: (listId, categoryId, itemId, updates) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) => {
                if (category.id !== categoryId) return category
                return {
                  ...category,
                  items: category.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteItem: (listId, categoryId, itemId) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) => {
                if (category.id !== categoryId) return category
                const filteredItems = category.items
                  .filter((item) => item.id !== itemId)
                  .map((item, index) => ({ ...item, order: index }))
                return {
                  ...category,
                  items: filteredItems,
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      toggleItemPacked: (listId, categoryId, itemId) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) => {
                if (category.id !== categoryId) return category
                return {
                  ...category,
                  items: category.items.map((item) =>
                    item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
                  ),
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      reorderItems: (listId, categoryId, itemIds) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              categories: list.categories.map((category) => {
                if (category.id !== categoryId) return category
                const reorderedItems = itemIds
                  .map((id, index) => {
                    const item = category.items.find((i) => i.id === id)
                    return item ? { ...item, order: index } : null
                  })
                  .filter((item): item is PackingItem => item !== null)
                return {
                  ...category,
                  items: reorderedItems,
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      moveItemToCategory: (listId, fromCategoryId, toCategoryId, itemId) => {
        set((state) => ({
          packingLists: state.packingLists.map((list) => {
            if (list.id !== listId) return list

            let movedItem: PackingItem | null = null

            const updatedCategories = list.categories.map((category) => {
              if (category.id === fromCategoryId) {
                const item = category.items.find((i) => i.id === itemId)
                if (item) {
                  movedItem = { ...item, categoryId: toCategoryId }
                }
                const filteredItems = category.items
                  .filter((i) => i.id !== itemId)
                  .map((i, index) => ({ ...i, order: index }))
                return { ...category, items: filteredItems }
              }
              return category
            })

            if (!movedItem) return list

            return {
              ...list,
              categories: updatedCategories.map((category) => {
                if (category.id === toCategoryId) {
                  return {
                    ...category,
                    items: [...category.items, { ...movedItem!, order: category.items.length }],
                  }
                }
                return category
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      // Utility selectors
      getPackedItemsCount: (listId) => {
        const list = get().packingLists.find((l) => l.id === listId)
        if (!list) return { packed: 0, total: 0 }

        let packed = 0
        let total = 0

        list.categories.forEach((category) => {
          category.items.forEach((item) => {
            total += item.quantity
            if (item.isPacked) packed += item.quantity
          })
        })

        return { packed, total }
      },

      getEssentialItems: (listId) => {
        const list = get().packingLists.find((l) => l.id === listId)
        if (!list) return []

        return list.categories.flatMap((category) =>
          category.items.filter((item) => item.isEssential)
        )
      },
    }),
    {
      name: 'reiseplaner-packing',
    }
  )
)
