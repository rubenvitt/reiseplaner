'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '../stores/gamificationStore'
import { getLevelByPoints } from '../data/levels'

interface GamificationHeaderProps {
  profilePath?: string
  className?: string
}

const getIcon = (iconName: string) => {
  const IconsMap = Icons as unknown as Record<string, typeof Icons.Award>
  return IconsMap[iconName] || Icons.Award
}

export function GamificationHeader({
  profilePath = '/profile',
  className,
}: GamificationHeaderProps) {
  const { totalPoints, currentLevel: levelNumber, currentStreak } = useGamificationStore()
  const currentLevel = getLevelByPoints(totalPoints)

  const LevelIcon = getIcon(currentLevel.icon)
  const hasStreak = currentStreak > 0

  return (
    <Link to={profilePath} className={cn('block', className)}>
      <motion.div
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-xl',
          'bg-card/50 border border-border/50',
          'hover:bg-card hover:border-border transition-all cursor-pointer'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Level badge */}
        <div className="relative">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30'
            )}
          >
            <LevelIcon className={cn('w-5 h-5', currentLevel.color)} />
          </div>

          {/* Level number badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {levelNumber}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-semibold', currentLevel.color)}>
              {currentLevel.title}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Points */}
            <div className="flex items-center gap-1">
              <Icons.Sparkles className="w-3 h-3 text-amber-500" />
              <span>{totalPoints}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1">
              {hasStreak ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Icons.Flame className="w-3 h-3 text-orange-500" />
                </motion.div>
              ) : (
                <Icons.Flame className="w-3 h-3" />
              )}
              <span className={hasStreak ? 'text-orange-500 font-medium' : ''}>
                {currentStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <Icons.ChevronRight className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </Link>
  )
}

// Alternative compact version for very small spaces
export function GamificationHeaderCompact({
  profilePath = '/profile',
  className,
}: GamificationHeaderProps) {
  const { totalPoints, currentStreak } = useGamificationStore()
  const currentLevel = getLevelByPoints(totalPoints)
  const LevelIcon = getIcon(currentLevel.icon)
  const hasStreak = currentStreak > 0

  return (
    <Link to={profilePath} className={cn('block', className)}>
      <motion.div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'hover:bg-muted/50 transition-colors cursor-pointer'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Level icon */}
        <div className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center',
          'bg-primary/10'
        )}>
          <LevelIcon className={cn('w-3.5 h-3.5', currentLevel.color)} />
        </div>

        {/* Points */}
        <div className="flex items-center gap-1 text-xs">
          <Icons.Sparkles className="w-3 h-3 text-amber-500" />
          <span className="font-medium">{totalPoints}</span>
        </div>

        {/* Streak divider */}
        <div className="w-px h-3 bg-border" />

        {/* Streak */}
        <div className="flex items-center gap-1 text-xs">
          {hasStreak ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              <Icons.Flame className="w-3 h-3 text-orange-500" />
            </motion.div>
          ) : (
            <Icons.Flame className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={cn(
            'font-medium',
            hasStreak ? 'text-orange-500' : 'text-muted-foreground'
          )}>
            {currentStreak}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
