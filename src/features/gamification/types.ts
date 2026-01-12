/**
 * Gamification Types
 *
 * Type-Definitionen für das Gamification-System
 */

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type AchievementCategory =
  | 'reisen'
  | 'planung'
  | 'budget'
  | 'packen'
  | 'streak'
  | 'social'
  | 'special'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: AchievementRarity
  category: AchievementCategory
  points: number
  condition: {
    type: string
    threshold: number
  }
}

export interface UnlockedAchievement {
  achievementId: string
  unlockedAt: string
}

export interface Level {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  icon: string
}

export interface GamificationStats {
  totalPoints: number
  currentLevel: Level
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  unlockedAchievements: UnlockedAchievement[]
  tripsCompleted: number
  itemsPacked: number
  budgetEntries: number
  itineraryItems: number
}

export interface GamificationState extends GamificationStats {
  // Actions
  addPoints: (points: number, source?: string) => void
  unlockAchievement: (achievementId: string) => void
  updateStreak: () => void
  incrementStat: (stat: 'tripsCompleted' | 'itemsPacked' | 'budgetEntries' | 'itineraryItems', amount?: number) => void
  checkAchievements: () => Achievement[]
  getAchievementById: (id: string) => Achievement | undefined
  isAchievementUnlocked: (id: string) => boolean
  getProgress: () => { unlocked: number; total: number; percentage: number }
  resetStats: () => void
}
