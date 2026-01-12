'use client'

import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { Toast } from './Toast'

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)

  // Only show max 5 toasts (most recent ones)
  const visibleToasts = toasts.slice(-5)

  return (
    <div
      aria-live="polite"
      aria-label="Benachrichtigungen"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
