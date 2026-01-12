'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { scaleIn, springTransition } from '@/lib/animations'

interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
}

/**
 * ScaleIn - Scale-Animation Wrapper
 *
 * Animiert das Element mit einem Scale-Effekt von klein zu groß.
 * Nutzt Spring-Animation für natürliches Bounce-Gefühl.
 *
 * @example
 * <ScaleIn>
 *   <Card>Content</Card>
 * </ScaleIn>
 *
 * @example
 * // Mit Verzögerung
 * <ScaleIn delay={0.3} duration={0.4}>
 *   <Button>Click me</Button>
 * </ScaleIn>
 */
export function ScaleIn({
  children,
  delay = 0,
  duration,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={scaleIn}
      transition={{
        ...springTransition,
        delay,
        ...(duration !== undefined && { type: 'tween', duration }),
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
