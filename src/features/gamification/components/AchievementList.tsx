'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Lock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '../stores/gamificationStore'
import { achievements, type AchievementCategory } from '../data/achievements'
import { AchievementBadge } from './AchievementBadge'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface AchievementListProps {
  className?: string
}

const categories: { value: AchievementCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'trips', label: 'Reisen' },
  { value: 'budget', label: 'Budget' },
  { value: 'planning', label: 'Planung' },
  { value: 'exploration', label: 'Entdeckung' },
]

export function AchievementList({ className }: AchievementListProps) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const { unlockedAchievements, isAchievementUnlocked } = useGamificationStore()

  const filteredAchievements = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory)

    // Sort: unlocked first, then by rarity (legendary first), then by points
    return [...filtered].sort((a, b) => {
      const aUnlocked = isAchievementUnlocked(a.id)
      const bUnlocked = isAchievementUnlocked(b.id)

      if (aUnlocked !== bUnlocked) {
        return aUnlocked ? -1 : 1
      }

      const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']
      const aRarityIndex = rarityOrder.indexOf(a.rarity)
      const bRarityIndex = rarityOrder.indexOf(b.rarity)

      if (aRarityIndex !== bRarityIndex) {
        return aRarityIndex - bRarityIndex
      }

      return b.points - a.points
    })
  }, [selectedCategory, isAchievementUnlocked])

  const unlockedCount = unlockedAchievements.length
  const totalCount = achievements.length
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Achievements</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              {unlockedCount} von {totalCount} freigeschaltet
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-center">
          {progressPercentage}% abgeschlossen
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
              selectedCategory === category.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement) => {
            const unlocked = isAchievementUnlocked(achievement.id)

            return (
              <motion.div
                key={achievement.id}
                variants={staggerItem}
                layout
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                  unlocked
                    ? 'bg-card border-border'
                    : 'bg-muted/50 border-transparent opacity-60'
                )}
              >
                <AchievementBadge
                  achievement={achievement}
                  unlocked={unlocked}
                  size="lg"
                  showTooltip={false}
                />

                <div className="text-center">
                  <div className="text-sm font-medium line-clamp-1">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {achievement.points} Punkte
                  </div>
                </div>

                {!unlocked && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Gesperrt</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Keine Achievements in dieser Kategorie gefunden.
        </div>
      )}
    </div>
  )
}
