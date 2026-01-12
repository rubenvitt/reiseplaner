'use client'

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '../stores/gamificationStore'
import { achievements, rarityColors, type AchievementRarity } from '../data/achievements'

const AUTO_DISMISS_DELAY = 4000

const rarityGradients: Record<AchievementRarity, string> = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-emerald-600',
  rare: 'from-blue-500 to-indigo-600',
  epic: 'from-purple-500 to-violet-600',
  legendary: 'from-amber-400 via-yellow-500 to-orange-500',
}

const getIcon = (iconName: string) => {
  const IconsMap = Icons as unknown as Record<string, typeof Icons.Award>
  return IconsMap[iconName] || Icons.Award
}

const triggerConfetti = (rarity: AchievementRarity) => {
  const colors = {
    common: ['#9ca3af', '#6b7280'],
    uncommon: ['#22c55e', '#10b981'],
    rare: ['#3b82f6', '#6366f1'],
    epic: ['#a855f7', '#8b5cf6'],
    legendary: ['#f59e0b', '#eab308', '#f97316'],
  }

  const particleCount = {
    common: 30,
    uncommon: 50,
    rare: 80,
    epic: 120,
    legendary: 200,
  }

  // Center burst
  confetti({
    particleCount: particleCount[rarity],
    spread: 70,
    origin: { y: 0.5, x: 0.5 },
    colors: colors[rarity],
    disableForReducedMotion: true,
  })

  // For legendary, add extra effects
  if (rarity === 'legendary') {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors[rarity],
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors[rarity],
      })
    }, 200)
  }
}

interface AchievementPopupContentProps {
  achievementId: string
  onClose: () => void
}

function AchievementPopupContent({ achievementId, onClose }: AchievementPopupContentProps) {
  const achievement = achievements.find((a) => a.id === achievementId)

  useEffect(() => {
    if (achievement) {
      triggerConfetti(achievement.rarity)
    }

    const timer = setTimeout(() => {
      onClose()
    }, AUTO_DISMISS_DELAY)

    return () => clearTimeout(timer)
  }, [achievement, onClose])

  if (!achievement) return null

  const Icon = getIcon(achievement.icon)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl blur-xl opacity-50',
          `bg-gradient-to-br ${rarityGradients[achievement.rarity]}`
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main card */}
      <div
        className={cn(
          'relative bg-card border border-border rounded-2xl p-6 shadow-2xl',
          'min-w-[300px] max-w-[400px]'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="inline-flex items-center gap-1 text-amber-500 mb-2"
          >
            <Icons.Trophy className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Achievement freigeschaltet!
            </span>
          </motion.div>
        </div>

        {/* Achievement icon */}
        <div className="flex justify-center mb-4">
          <motion.div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center',
              `bg-gradient-to-br ${rarityGradients[achievement.rarity]}`
            )}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Achievement info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {achievement.description}
          </p>

          {/* Points badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              rarityColors[achievement.rarity]
            )}
          >
            <Icons.Sparkles className="w-4 h-4" />
            <span className="font-semibold">+{achievement.points} Punkte</span>
          </motion.div>
        </motion.div>

        {/* Progress bar animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-2xl overflow-hidden"
        >
          <motion.div
            className={cn(
              'h-full',
              `bg-gradient-to-r ${rarityGradients[achievement.rarity]}`
            )}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: AUTO_DISMISS_DELAY / 1000, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function AchievementPopup() {
  const [mounted, setMounted] = useState(false)
  const { pendingAchievements, popPendingAchievement } = useGamificationStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = useCallback(() => {
    popPendingAchievement()
  }, [popPendingAchievement])

  const currentAchievement = pendingAchievements[0]

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {currentAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 pointer-events-auto"
            onClick={handleClose}
          />

          {/* Content */}
          <div className="relative pointer-events-auto">
            <AchievementPopupContent
              achievementId={currentAchievement}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
