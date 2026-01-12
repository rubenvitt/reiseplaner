'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Achievement, type AchievementRarity, rarityColors } from '../data/achievements'

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
}

const iconSizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
}

const rarityBorderColors: Record<AchievementRarity, string> = {
  common: 'border-gray-400 dark:border-gray-600',
  uncommon: 'border-green-500 dark:border-green-400',
  rare: 'border-blue-500 dark:border-blue-400',
  epic: 'border-purple-500 dark:border-purple-400',
  legendary: 'border-amber-500 dark:border-amber-400',
}

const rarityGlowColors: Record<AchievementRarity, string> = {
  common: '',
  uncommon: 'shadow-green-500/30',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-amber-500/50',
}

const rarityBackgroundColors: Record<AchievementRarity, string> = {
  common: 'bg-gray-100 dark:bg-gray-800',
  uncommon: 'bg-green-100 dark:bg-green-900/30',
  rare: 'bg-blue-100 dark:bg-blue-900/30',
  epic: 'bg-purple-100 dark:bg-purple-900/30',
  legendary: 'bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/40 dark:to-yellow-900/30',
}

const getIcon = (iconName: string) => {
  const IconsMap = Icons as unknown as Record<string, typeof Icons.Award>
  return IconsMap[iconName] || Icons.Award
}

export function AchievementBadge({
  achievement,
  unlocked = false,
  size = 'md',
  showTooltip = true,
  className,
}: AchievementBadgeProps) {
  const Icon = getIcon(achievement.icon)

  return (
    <div className={cn('relative group', className)}>
      <motion.div
        className={cn(
          'relative rounded-full border-2 flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          unlocked
            ? [
                rarityBorderColors[achievement.rarity],
                rarityBackgroundColors[achievement.rarity],
                achievement.rarity !== 'common' && `shadow-lg ${rarityGlowColors[achievement.rarity]}`,
              ]
            : 'border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800'
        )}
        whileHover={unlocked ? { scale: 1.1 } : undefined}
        whileTap={unlocked ? { scale: 0.95 } : undefined}
      >
        <Icon
          className={cn(
            iconSizeClasses[size],
            unlocked
              ? rarityColors[achievement.rarity].split(' ')[0]
              : 'text-gray-400 dark:text-gray-600'
          )}
        />

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 dark:bg-black/40">
            <Icons.Lock className={cn(
              'text-gray-500 dark:text-gray-400',
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          </div>
        )}

        {/* Legendary shimmer effect */}
        {unlocked && achievement.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'linear',
            }}
            style={{ overflow: 'hidden' }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
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
          <div className="font-semibold">{achievement.title}</div>
          <div className="text-xs text-muted-foreground max-w-[200px] whitespace-normal">
            {achievement.description}
          </div>
          <div className={cn(
            'text-xs mt-1 font-medium',
            rarityColors[achievement.rarity].split(' ')[0]
          )}>
            {achievement.points} Punkte
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-popover" />
          </div>
        </div>
      )}
    </div>
  )
}
