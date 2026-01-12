import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReactNode } from 'react'

// Toast types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement'
  title: string
  message?: string
  duration?: number // ms, default 5000
  icon?: ReactNode
}

// Persisted state (saved to localStorage)
interface PersistedUIState {
  isFirstVisit: boolean
  prefersReducedMotion: boolean
}

// Non-persisted state (toasts)
interface TransientUIState {
  toasts: Toast[]
}

// Actions
interface UIActions {
  // First visit
  setFirstVisit: (value: boolean) => void

  // Reduced motion
  setPrefersReducedMotion: (value: boolean) => void

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

type UIState = PersistedUIState & TransientUIState & UIActions

// Generate unique ID for toasts
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Persisted state
      isFirstVisit: true,
      prefersReducedMotion: false,

      // Transient state (not persisted)
      toasts: [],

      // First visit actions
      setFirstVisit: (value) => set({ isFirstVisit: value }),

      // Reduced motion actions
      setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),

      // Toast actions
      addToast: (toast) => {
        const id = generateId()
        const newToast: Toast = {
          ...toast,
          id,
          duration: toast.duration ?? 5000,
        }

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }))

        // Auto-remove toast after duration (if duration > 0)
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, newToast.duration)
        }

        return id
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }))
      },

      clearAllToasts: () => {
        set({ toasts: [] })
      },
    }),
    {
      name: 'reiseplaner-ui',
      // Only persist these fields (NOT toasts)
      partialize: (state) => ({
        isFirstVisit: state.isFirstVisit,
        prefersReducedMotion: state.prefersReducedMotion,
      }),
    }
  )
)

// Initialize reduced motion preference from system
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  // Set initial value on first load (only if not already set by user)
  const storedState = localStorage.getItem('reiseplaner-ui')
  if (!storedState) {
    useUIStore.setState({ prefersReducedMotion: mediaQuery.matches })
  }

  // Listen for system preference changes
  mediaQuery.addEventListener('change', (event) => {
    useUIStore.setState({ prefersReducedMotion: event.matches })
  })
}

// Convenience hook for toast operations
export function useToast() {
  const addToast = useUIStore((state) => state.addToast)
  const removeToast = useUIStore((state) => state.removeToast)

  return {
    toast: (options: Omit<Toast, 'id'>) => addToast(options),
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
    achievement: (title: string, message?: string) =>
      addToast({ type: 'achievement', title, message }),
    dismiss: removeToast,
  }
}
