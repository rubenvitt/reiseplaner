import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TripDocument, DocumentCategory } from '@/types'

interface DocumentsState {
  documents: TripDocument[]

  // CRUD
  addDocument: (doc: Omit<TripDocument, 'id' | 'uploadedAt'>) => string
  updateDocument: (id: string, updates: Partial<Omit<TripDocument, 'id' | 'uploadedAt'>>) => void
  deleteDocument: (id: string) => void

  // Getters
  getDocument: (id: string) => TripDocument | undefined
  getDocumentsByTrip: (tripId: string) => TripDocument[]
  getDocumentsByCategory: (tripId: string, category: DocumentCategory) => TripDocument[]
}

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [],

      addDocument: (docData) => {
        const id = crypto.randomUUID()
        const newDoc: TripDocument = {
          ...docData,
          id,
          uploadedAt: new Date().toISOString(),
        }
        set((state) => ({
          documents: [...state.documents, newDoc],
        }))
        return id
      },

      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        }))
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }))
      },

      getDocument: (id) => {
        return get().documents.find((doc) => doc.id === id)
      },

      getDocumentsByTrip: (tripId) => {
        return get().documents.filter((doc) => doc.tripId === tripId)
      },

      getDocumentsByCategory: (tripId, category) => {
        return get().documents.filter(
          (doc) => doc.tripId === tripId && doc.category === category
        )
      },
    }),
    {
      name: 'reiseplaner-documents',
    }
  )
)
