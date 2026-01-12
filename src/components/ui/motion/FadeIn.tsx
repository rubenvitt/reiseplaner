'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  smoothTransition,
} from '@/lib/animations'

type FadeDirection = 'up' | 'down' | 'left' | 'right'

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: FadeDirection
}

const directionVariants = {
  up: fadeInUp,
  down: fadeInDown,
  left: slideInLeft,
  right: slideInRight,
} as const

/**
 * FadeIn - Wrapper-Komponente für Fade-Animationen
 *
 * @example
 * // Einfaches Fade
 * <FadeIn>
 *   <div>Content</div>
 * </FadeIn>
 *
 * @example
 * // Fade von unten mit Delay
 * <FadeIn direction="up" delay={0.2}>
 *   <Card>...</Card>
 * </FadeIn>
 */
export function FadeIn({
  children,
  delay = 0,
  duration,
  direction,
  ...props
}: FadeInProps) {
  const baseVariants = direction ? directionVariants[direction] : fadeIn

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={baseVariants}
      transition={{
        ...smoothTransition,
        delay,
        ...(duration !== undefined && { duration }),
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
