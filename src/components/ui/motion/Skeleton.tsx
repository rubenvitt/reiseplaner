'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

/**
 * Skeleton - Loading-Skeleton mit Shimmer-Animation
 *
 * Zeigt einen animierten Platzhalter während Daten geladen werden.
 * Der Shimmer-Effekt vermittelt dem Nutzer, dass Inhalt geladen wird.
 *
 * @example
 * // Einfacher Text-Skeleton
 * <Skeleton width="200px" height="20px" />
 *
 * @example
 * // Avatar-Skeleton
 * <Skeleton width={48} height={48} rounded="full" />
 *
 * @example
 * // Card-Skeleton
 * <div className="space-y-4">
 *   <Skeleton height="200px" rounded="lg" />
 *   <Skeleton width="60%" height="24px" />
 *   <Skeleton width="80%" height="16px" />
 *   <Skeleton width="40%" height="16px" />
 * </div>
 */
export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}
