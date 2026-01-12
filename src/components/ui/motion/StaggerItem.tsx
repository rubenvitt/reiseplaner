'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  className?: string
}

/**
 * StaggerItem - Item-Komponente für gestaffelte Listen
 *
 * Muss innerhalb eines StaggerList-Containers verwendet werden.
 * Erbt die Animations-Verzögerung vom Parent-Container.
 *
 * @example
 * <StaggerList>
 *   <StaggerItem>
 *     <Card>First item</Card>
 *   </StaggerItem>
 *   <StaggerItem>
 *     <Card>Second item</Card>
 *   </StaggerItem>
 * </StaggerList>
 */
export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
