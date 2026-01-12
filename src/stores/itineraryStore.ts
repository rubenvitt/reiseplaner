import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DayPlan, Activity } from '@/types'

interface ItineraryState {
  dayPlans: DayPlan[]

  // DayPlan CRUD
  addDayPlan: (dayPlan: Omit<DayPlan, 'id' | 'activities'>) => string
  updateDayPlan: (id: string, updates: Partial<Omit<DayPlan, 'id' | 'activities'>>) => void
  deleteDayPlan: (id: string) => void
  getDayPlan: (id: string) => DayPlan | undefined
  getDayPlansByTrip: (tripId: string) => DayPlan[]
  getDayPlanByDate: (tripId: string, date: string) => DayPlan | undefined

  // Activity CRUD
  addActivity: (dayId: string, activity: Omit<Activity, 'id' | 'dayId' | 'order'>) => string
  updateActivity: (dayId: string, activityId: string, updates: Partial<Omit<Activity, 'id' | 'dayId'>>) => void
  deleteActivity: (dayId: string, activityId: string) => void
  toggleActivityCompleted: (dayId: string, activityId: string) => void
  reorderActivities: (dayId: string, activityIds: string[]) => void
  moveActivityToDay: (fromDayId: string, toDayId: string, activityId: string, newOrder: number) => void
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      dayPlans: [],

      // DayPlan CRUD
      addDayPlan: (dayPlanData) => {
        const id = crypto.randomUUID()
        const newDayPlan: DayPlan = {
          ...dayPlanData,
          id,
          activities: [],
        }
        set((state) => ({
          dayPlans: [...state.dayPlans, newDayPlan],
        }))
        return id
      },

      updateDayPlan: (id, updates) => {
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) =>
            dayPlan.id === id ? { ...dayPlan, ...updates } : dayPlan
          ),
        }))
      },

      deleteDayPlan: (id) => {
        set((state) => ({
          dayPlans: state.dayPlans.filter((dayPlan) => dayPlan.id !== id),
        }))
      },

      getDayPlan: (id) => {
        return get().dayPlans.find((dayPlan) => dayPlan.id === id)
      },

      getDayPlansByTrip: (tripId) => {
        return get()
          .dayPlans.filter((dayPlan) => dayPlan.tripId === tripId)
          .sort((a, b) => {
            // Items ohne Datum ans Ende
            if (!a.date && !b.date) return 0
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          })
      },

      getDayPlanByDate: (tripId, date) => {
        return get().dayPlans.find(
          (dayPlan) => dayPlan.tripId === tripId && dayPlan.date === date
        )
      },

      // Activity CRUD
      addActivity: (dayId, activityData) => {
        const id = crypto.randomUUID()
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) => {
            if (dayPlan.id !== dayId) return dayPlan
            const newActivity: Activity = {
              ...activityData,
              id,
              dayId,
              order: dayPlan.activities.length,
            }
            return {
              ...dayPlan,
              activities: [...dayPlan.activities, newActivity],
            }
          }),
        }))
        return id
      },

      updateActivity: (dayId, activityId, updates) => {
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) => {
            if (dayPlan.id !== dayId) return dayPlan
            return {
              ...dayPlan,
              activities: dayPlan.activities.map((activity) =>
                activity.id === activityId ? { ...activity, ...updates } : activity
              ),
            }
          }),
        }))
      },

      deleteActivity: (dayId, activityId) => {
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) => {
            if (dayPlan.id !== dayId) return dayPlan
            const filteredActivities = dayPlan.activities
              .filter((activity) => activity.id !== activityId)
              .map((activity, index) => ({ ...activity, order: index }))
            return {
              ...dayPlan,
              activities: filteredActivities,
            }
          }),
        }))
      },

      toggleActivityCompleted: (dayId, activityId) => {
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) => {
            if (dayPlan.id !== dayId) return dayPlan
            return {
              ...dayPlan,
              activities: dayPlan.activities.map((activity) =>
                activity.id === activityId
                  ? { ...activity, isCompleted: !activity.isCompleted }
                  : activity
              ),
            }
          }),
        }))
      },

      reorderActivities: (dayId, activityIds) => {
        set((state) => ({
          dayPlans: state.dayPlans.map((dayPlan) => {
            if (dayPlan.id !== dayId) return dayPlan
            const reorderedActivities = activityIds
              .map((id, index) => {
                const activity = dayPlan.activities.find((a) => a.id === id)
                return activity ? { ...activity, order: index } : null
              })
              .filter((activity): activity is Activity => activity !== null)
            return {
              ...dayPlan,
              activities: reorderedActivities,
            }
          }),
        }))
      },

      moveActivityToDay: (fromDayId, toDayId, activityId, newOrder) => {
        set((state) => {
          let movedActivity: Activity | null = null

          // Find and remove the activity from the source day
          const updatedDayPlans = state.dayPlans.map((dayPlan) => {
            if (dayPlan.id === fromDayId) {
              const activity = dayPlan.activities.find((a) => a.id === activityId)
              if (activity) {
                movedActivity = { ...activity, dayId: toDayId, order: newOrder }
              }
              const filteredActivities = dayPlan.activities
                .filter((a) => a.id !== activityId)
                .map((a, index) => ({ ...a, order: index }))
              return { ...dayPlan, activities: filteredActivities }
            }
            return dayPlan
          })

          if (!movedActivity) return state

          // Add the activity to the target day
          return {
            dayPlans: updatedDayPlans.map((dayPlan) => {
              if (dayPlan.id === toDayId) {
                const activities = [...dayPlan.activities]
                activities.splice(newOrder, 0, movedActivity!)
                return {
                  ...dayPlan,
                  activities: activities.map((a, index) => ({ ...a, order: index })),
                }
              }
              return dayPlan
            }),
          }
        })
      },
    }),
    {
      name: 'reiseplaner-itinerary',
    }
  )
)
