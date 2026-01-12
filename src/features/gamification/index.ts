// Store
export { useGamificationStore } from './stores/gamificationStore'
export type { UnlockedAchievement, AchievementContext } from './stores/gamificationStore'

// Achievement data
export {
  achievements,
  getAchievementById,
  getAchievementsByCategory,
  getAchievementsByRarity,
  rarityColors,
  rarityLabels
} from './data/achievements'
export type {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  AchievementCondition
} from './data/achievements'

// Level data
export {
  levels,
  getLevelByPoints,
  getLevelByNumber,
  getNextLevel,
  getProgressToNextLevel
} from './data/levels'
export type { Level } from './data/levels'
