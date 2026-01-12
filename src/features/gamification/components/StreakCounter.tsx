'use client'

import { motion } from 'framer-motion'
import { Flame, Zap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '../stores/gamificationStore'

interface StreakCounterProps {
  showLongest?: boolean
  compact?: boolean
  className?: string
}

export function StreakCounter({
  showLongest = true,
  compact = false,
  className,
}: StreakCounterProps) {
  const { currentStreak, longestStreak } = useGamificationStore()

  const hasStreak = currentStreak > 0
  const isHotStreak = currentStreak >= 7
  const isOnFire = currentStreak >= 30

  // Determine which icon to use based on streak
  const getStreakIcon = () => {
    if (isOnFire) return Trophy
    if (isHotStreak) return Zap
    return Flame
  }

  const StreakIcon = getStreakIcon()

  // Color based on streak level
  const getStreakColor = () => {
    if (isOnFire) return 'text-amber-500'
    if (isHotStreak) return 'text-orange-500'
    if (hasStreak) return 'text-red-500'
    return 'text-muted-foreground'
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {hasStreak ? (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <StreakIcon className={cn('w-4 h-4', getStreakColor())} />
          </motion.div>
        ) : (
          <Flame className="w-4 h-4 text-muted-foreground" />
        )}
        <span className={cn('text-sm font-medium', hasStreak ? getStreakColor() : 'text-muted-foreground')}>
          {currentStreak}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('relative group', className)}>
      <motion.div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl',
          'bg-card border border-border',
          hasStreak && 'border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-500/5'
        )}
        whileHover={{ scale: 1.02 }}
      >
        {/* Flame icon with animation */}
        <div className="relative">
          {hasStreak ? (
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              <StreakIcon className={cn('w-8 h-8', getStreakColor())} />
            </motion.div>
          ) : (
            <Flame className="w-8 h-8 text-muted-foreground" />
          )}

          {/* Glow effect for hot streaks */}
          {isHotStreak && (
            <motion.div
              className="absolute inset-0 rounded-full blur-md bg-orange-500/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Streak info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              'text-2xl font-bold',
              hasStreak ? getStreakColor() : 'text-foreground'
            )}>
              {currentStreak}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentStreak === 1 ? 'Tag' : 'Tage'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {hasStreak ? 'Aktive Streak' : 'Keine aktive Streak'}
          </div>
        </div>

        {/* Best streak badge */}
        {showLongest && longestStreak > 0 && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Beste</div>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
              <Trophy className="w-3.5 h-3.5" />
              {longestStreak}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      {showLongest && longestStreak > 0 && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg',
            'bg-popover text-popover-foreground border border-border',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-200 transform -translate-x-1/2 left-1/2',
            'bottom-full mb-2 whitespace-nowrap',
            'pointer-events-none'
          )}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Laengste Streak: <strong>{longestStreak} Tage</strong></span>
          </div>
        </div>
      )}

      {/* Milestone indicators */}
      {hasStreak && (
        <div className="flex gap-1 mt-2">
          {[3, 7, 30, 100].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                'h-1 flex-1 rounded-full',
                currentStreak >= milestone
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
