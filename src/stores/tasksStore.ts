import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskCategory } from '@/types'

interface TasksState {
  tasks: Task[]

  // CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => string
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void

  // Getters
  getTask: (id: string) => Task | undefined
  getTasksByTrip: (tripId: string) => Task[]
  getTasksByCategory: (tripId: string, category: TaskCategory) => Task[]
  getOpenTasks: (tripId: string) => Task[]
  getCompletedTasks: (tripId: string) => Task[]
  getOverdueTasks: (tripId: string) => Task[]
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const id = crypto.randomUUID()
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
        return id
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      toggleTaskStatus: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task
            const newStatus = task.status === 'open' ? 'completed' : 'open'
            return {
              ...task,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
            }
          }),
        }))
      },

      getTask: (id) => {
        return get().tasks.find((task) => task.id === id)
      },

      getTasksByTrip: (tripId) => {
        return get().tasks.filter((task) => task.tripId === tripId)
      },

      getTasksByCategory: (tripId, category) => {
        return get().tasks.filter(
          (task) => task.tripId === tripId && task.category === category
        )
      },

      getOpenTasks: (tripId) => {
        return get().tasks.filter(
          (task) => task.tripId === tripId && task.status === 'open'
        )
      },

      getCompletedTasks: (tripId) => {
        return get().tasks.filter(
          (task) => task.tripId === tripId && task.status === 'completed'
        )
      },

      getOverdueTasks: (tripId) => {
        const now = new Date()
        return get().tasks.filter((task) => {
          if (task.tripId !== tripId || task.status === 'completed') return false
          if (!task.deadline) return false
          return new Date(task.deadline) < now
        })
      },
    }),
    {
      name: 'reiseplaner-tasks',
    }
  )
)
