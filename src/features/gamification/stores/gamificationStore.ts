import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { achievements, type Achievement, type AchievementCondition } from '../data/achievements'
import { getLevelByPoints } from '../data/levels'

export interface UnlockedAchievement {
  id: string
  unlockedAt: string // ISO date
}

export interface AchievementContext {
  tripsCreated: number
  countriesVisited: number
  maxDaysAdvance: number
  packingListsComplete: number
  currentStreak: number
  activitiesPlanned: number
  expensesTracked: number
  accommodationsBooked: number
  tripsUnderBudget: number
}

interface GamificationState {
  // Points & Level
  totalPoints: number
  currentLevel: number

  // Achievements
  unlockedAchievements: UnlockedAchievement[]
  pendingAchievements: string[] // Queue for animation

  // Streaks
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null

  // Actions
  addPoints: (points: number) => void
  unlockAchievement: (achievementId: string) => void
  popPendingAchievement: () => string | null
  updateStreak: () => void
  checkAndUnlockAchievements: (context: AchievementContext) => void
  isAchievementUnlocked: (achievementId: string) => boolean
  getUnlockedAchievement: (achievementId: string) => UnlockedAchievement | undefined
  reset: () => void
}

const calculateLevel = (points: number): number => {
  return getLevelByPoints(points).level
}

const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

const isToday = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

const checkCondition = (condition: AchievementCondition, context: AchievementContext): boolean => {
  switch (condition.type) {
    case 'trips_created':
      return context.tripsCreated >= condition.value
    case 'countries_visited':
      return context.countriesVisited >= condition.value
    case 'days_advance':
      return context.maxDaysAdvance >= condition.value
    case 'packing_lists_complete':
      return context.packingListsComplete >= condition.value
    case 'streak_days':
      return context.currentStreak >= condition.value
    case 'activities_planned':
      return context.activitiesPlanned >= condition.value
    case 'expenses_tracked':
      return context.expensesTracked >= condition.value
    case 'accommodations_booked':
      return context.accommodationsBooked >= condition.value
    case 'trips_under_budget':
      return context.tripsUnderBudget >= condition.value
    default:
      return false
  }
}

const initialState = {
  totalPoints: 0,
  currentLevel: 1,
  unlockedAchievements: [],
  pendingAchievements: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPoints: (points: number) => {
        set((state) => {
          const newTotalPoints = state.totalPoints + points
          const newLevel = calculateLevel(newTotalPoints)
          return {
            totalPoints: newTotalPoints,
            currentLevel: newLevel
          }
        })
      },

      unlockAchievement: (achievementId: string) => {
        const state = get()

        // Check if already unlocked
        if (state.unlockedAchievements.some(a => a.id === achievementId)) {
          return
        }

        // Find the achievement to get its points
        const achievement = achievements.find(a => a.id === achievementId)
        if (!achievement) {
          return
        }

        set((currentState) => {
          const newUnlocked: UnlockedAchievement = {
            id: achievementId,
            unlockedAt: new Date().toISOString()
          }

          const newTotalPoints = currentState.totalPoints + achievement.points
          const newLevel = calculateLevel(newTotalPoints)

          return {
            unlockedAchievements: [...currentState.unlockedAchievements, newUnlocked],
            pendingAchievements: [...currentState.pendingAchievements, achievementId],
            totalPoints: newTotalPoints,
            currentLevel: newLevel
          }
        })
      },

      popPendingAchievement: (): string | null => {
        const state = get()
        if (state.pendingAchievements.length === 0) {
          return null
        }

        const [first, ...rest] = state.pendingAchievements
        set({ pendingAchievements: rest })
        return first
      },

      updateStreak: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]

        // If no last activity, start streak at 1
        if (!state.lastActivityDate) {
          set({
            currentStreak: 1,
            longestStreak: Math.max(1, state.longestStreak),
            lastActivityDate: today
          })
          return
        }

        // If already active today, do nothing
        if (isToday(state.lastActivityDate)) {
          return
        }

        // If active yesterday, increment streak
        if (isYesterday(state.lastActivityDate)) {
          const newStreak = state.currentStreak + 1
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastActivityDate: today
          })
          return
        }

        // Otherwise, reset streak to 1
        set({
          currentStreak: 1,
          longestStreak: state.longestStreak,
          lastActivityDate: today
        })
      },

      checkAndUnlockAchievements: (context: AchievementContext) => {
        const state = get()

        // Update context with current streak from store
        const contextWithStreak: AchievementContext = {
          ...context,
          currentStreak: state.currentStreak
        }

        achievements.forEach((achievement: Achievement) => {
          // Skip if already unlocked
          if (state.unlockedAchievements.some(a => a.id === achievement.id)) {
            return
          }

          // Check if condition is met
          if (checkCondition(achievement.condition, contextWithStreak)) {
            get().unlockAchievement(achievement.id)
          }
        })
      },

      isAchievementUnlocked: (achievementId: string): boolean => {
        return get().unlockedAchievements.some(a => a.id === achievementId)
      },

      getUnlockedAchievement: (achievementId: string): UnlockedAchievement | undefined => {
        return get().unlockedAchievements.find(a => a.id === achievementId)
      },

      reset: () => {
        set(initialState)
      }
    }),
    {
      name: 'reiseplaner-gamification'
    }
  )
)
