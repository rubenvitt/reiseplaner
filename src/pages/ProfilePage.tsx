'use client'

import { motion } from 'framer-motion'
import { User, Trophy, Star, Flame, TrendingUp } from 'lucide-react'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  LevelIndicator,
  AchievementList,
  StreakCounter,
} from '@/features/gamification/components'
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore'
import { getLevelByPoints, getProgressToNextLevel, getNextLevel } from '@/features/gamification/data/levels'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

const getIcon = (iconName: string) => {
  const IconsMap = Icons as unknown as Record<string, typeof Icons.Award>
  return IconsMap[iconName] || Icons.Award
}

export function ProfilePage() {
  const {
    totalPoints,
    currentLevel: levelNumber,
    currentStreak,
    longestStreak,
  } = useGamificationStore()

  const currentLevel = getLevelByPoints(totalPoints)
  const nextLevel = getNextLevel(levelNumber)
  const progress = getProgressToNextLevel(totalPoints)

  const LevelIcon = getIcon(currentLevel.icon)
  const isMaxLevel = !nextLevel

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Mein Profil</h1>
          </div>
          <LevelIndicator compact className="sm:self-end" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Statistik-Übersicht */}
          <motion.div variants={staggerItem}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gesamtpunkte */}
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={cn(
                        'p-2.5 rounded-xl',
                        'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
                        'border border-amber-500/30'
                      )}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Star className="w-5 h-5 text-amber-500" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gesamtpunkte</p>
                      <p className="text-xl font-bold text-foreground">
                        {totalPoints.toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aktuelles Level */}
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={cn(
                        'p-2.5 rounded-xl',
                        'bg-gradient-to-br from-primary/20 to-primary/10',
                        'border border-primary/30'
                      )}
                      whileHover={{ scale: 1.05, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LevelIcon className={cn('w-5 h-5', currentLevel.color)} />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xl font-bold text-foreground">{levelNumber}</p>
                        <span className={cn('text-sm font-medium', currentLevel.color)}>
                          {currentLevel.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aktuelle Streak */}
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={cn(
                        'p-2.5 rounded-xl',
                        currentStreak > 0
                          ? 'bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30'
                          : 'bg-muted border border-border'
                      )}
                      animate={
                        currentStreak > 0
                          ? {
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      <Flame
                        className={cn(
                          'w-5 h-5',
                          currentStreak >= 30
                            ? 'text-amber-500'
                            : currentStreak >= 7
                            ? 'text-orange-500'
                            : currentStreak > 0
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        )}
                      />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aktuelle Streak</p>
                      <p className="text-xl font-bold text-foreground">
                        {currentStreak} {currentStreak === 1 ? 'Tag' : 'Tage'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Längste Streak */}
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={cn(
                        'p-2.5 rounded-xl',
                        'bg-gradient-to-br from-purple-500/20 to-indigo-500/10',
                        'border border-purple-500/30'
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Trophy className="w-5 h-5 text-purple-500" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Längste Streak</p>
                      <p className="text-xl font-bold text-foreground">
                        {longestStreak} {longestStreak === 1 ? 'Tag' : 'Tage'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Level-Fortschritt */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Level-Fortschritt</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Level Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        'bg-gradient-to-br from-primary/20 to-primary/10',
                        'border-2 border-primary/30 shadow-lg shadow-primary/10'
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <LevelIcon className={cn('w-6 h-6', currentLevel.color)} />
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
                      <span className={cn('text-sm font-medium', currentLevel.color)}>
                        {currentLevel.title}
                      </span>
                    </div>
                  </div>

                  {nextLevel && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">Nächstes Level</p>
                      <p className="text-sm font-semibold">{nextLevel.title}</p>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{totalPoints.toLocaleString('de-DE')} Punkte</span>
                    {!isMaxLevel && nextLevel && (
                      <span>{nextLevel.minPoints.toLocaleString('de-DE')} Punkte</span>
                    )}
                  </div>

                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
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
                        repeatDelay: 3,
                        ease: 'linear',
                      }}
                    />
                  </div>

                  {!isMaxLevel ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Noch{' '}
                        <span className="font-semibold text-foreground">
                          {(progress.required - progress.current).toLocaleString('de-DE')}
                        </span>{' '}
                        Punkte bis Level {levelNumber + 1}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                      Du hast das maximale Level erreicht!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak Counter (vollständige Ansicht) */}
          <motion.div variants={staggerItem}>
            <StreakCounter showLongest={true} />
          </motion.div>

          {/* Achievement-Sektion */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent className="pt-6">
                <AchievementList />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
