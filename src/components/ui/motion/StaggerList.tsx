'use client'

import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StaggerListProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

/**
 * StaggerList - Container für gestaffelte Listen-Animationen
 *
 * Verwendet zusammen mit StaggerItem für gestaffelte Einblend-Animationen.
 * Jedes Kind-Element wird mit einer kleinen Verzögerung nach dem vorherigen animiert.
 *
 * @example
 * <StaggerList staggerDelay={0.15}>
 *   {items.map(item => (
 *     <StaggerItem key={item.id}>
 *       <Card>{item.content}</Card>
 *     </StaggerItem>
 *   ))}
 * </StaggerList>
 */
export function StaggerList({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerListProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: 0.05,
            },
          },
          exit: {
            transition: {
              staggerChildren: staggerDelay / 2,
              staggerDirection: -1,
            },
          },
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
