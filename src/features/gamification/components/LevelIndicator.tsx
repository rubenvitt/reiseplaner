'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '../stores/gamificationStore'
import { getLevelByPoints, getProgressToNextLevel, getNextLevel, type Level } from '../data/levels'

interface LevelIndicatorProps {
  showLabel?: boolean
  className?: string
  compact?: boolean
}

const getIcon = (iconName: string) => {
  const IconsMap = Icons as unknown as Record<string, typeof Icons.Award>
  return IconsMap[iconName] || Icons.Award
}

export function LevelIndicator({
  showLabel = true,
  compact = false,
  className,
}: LevelIndicatorProps) {
  const { totalPoints, currentLevel: levelNumber } = useGamificationStore()

  const currentLevel: Level = getLevelByPoints(totalPoints)
  const nextLevel = getNextLevel(levelNumber)
  const progress = getProgressToNextLevel(totalPoints)

  const Icon = getIcon(currentLevel.icon)
  const isMaxLevel = !nextLevel

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30'
          )}
        >
          <Icon className={cn('w-4 h-4', currentLevel.color)} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium">Lvl {levelNumber}</span>
          <span className="text-[10px] text-muted-foreground">{totalPoints} Pkt</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Level badge and title */}
      <div className="flex items-center gap-3">
        <motion.div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30',
            'shadow-lg shadow-primary/10'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={cn('w-6 h-6', currentLevel.color)} />
        </motion.div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Level {levelNumber}</span>
            {isMaxLevel && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                MAX
              </span>
            )}
          </div>
          {showLabel && (
            <span className={cn('text-sm font-medium', currentLevel.color)}>
              {currentLevel.title}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{totalPoints} Punkte</span>
          {!isMaxLevel && nextLevel && (
            <span>{nextLevel.minPoints} Punkte fuer Lvl {nextLevel.level}</span>
          )}
        </div>

        <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'linear',
            }}
          />
        </div>

        {!isMaxLevel && (
          <div className="text-xs text-muted-foreground text-center">
            {progress.current} / {progress.required} Punkte zum naechsten Level
          </div>
        )}
      </div>
    </div>
  )
}
