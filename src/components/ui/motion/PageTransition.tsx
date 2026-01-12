'use client'

import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface PageTransitionProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
}

/**
 * PageTransition - Wrapper für Seiten-Transitions
 *
 * Fügt sanfte Fade- und Slide-Animationen beim Seitenwechsel hinzu.
 * Sollte als Wrapper um den Haupt-Content einer Seite verwendet werden.
 *
 * @example
 * // In einer Route-Komponente
 * export default function DashboardPage() {
 *   return (
 *     <PageTransition>
 *       <div>
 *         <h1>Dashboard</h1>
 *         ...
 *       </div>
 *     </PageTransition>
 *   )
 * }
 *
 * @example
 * // Mit React Router und AnimatePresence
 * <AnimatePresence mode="wait">
 *   <Routes location={location} key={location.pathname}>
 *     <Route path="/" element={<PageTransition><Home /></PageTransition>} />
 *   </Routes>
 * </AnimatePresence>
 */
export function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
