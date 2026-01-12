import { useState, useMemo } from 'react'
import { Plus, CheckCircle, ListTodo, AlertTriangle, Filter } from 'lucide-react'
import type { Task, TaskCategory } from '@/types'
import { taskCategoryLabels } from '@/types'
import { useTasksStore } from '@/stores'
import { Button, Badge } from '@/components/ui'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'

interface TaskListProps {
  tripId: string
}

type FilterType = 'all' | 'open' | 'completed' | 'overdue'

export function TaskList({ tripId }: TaskListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [filter, setFilter] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all')

  const {
    getTasksByTrip,
    getOpenTasks,
    getCompletedTasks,
    getOverdueTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasksStore()

  const allTasks = getTasksByTrip(tripId)
  const openTasks = getOpenTasks(tripId)
  const completedTasks = getCompletedTasks(tripId)
  const overdueTasks = getOverdueTasks(tripId)

  const filteredTasks = useMemo(() => {
    let tasks: Task[]

    switch (filter) {
      case 'open':
        tasks = openTasks
        break
      case 'completed':
        tasks = completedTasks
        break
      case 'overdue':
        tasks = overdueTasks
        break
      default:
        tasks = allTasks
    }

    if (categoryFilter !== 'all') {
      tasks = tasks.filter((t) => t.category === categoryFilter)
    }

    // Sort: overdue first, then by deadline, then by priority
    return tasks.sort((a, b) => {
      // Completed tasks go to the bottom
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (a.status !== 'completed' && b.status === 'completed') return -1

      // Check overdue
      const aOverdue = a.deadline && new Date(a.deadline) < new Date() && a.status === 'open'
      const bOverdue = b.deadline && new Date(b.deadline) < new Date() && b.status === 'open'
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1

      // Sort by deadline
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      if (a.deadline && !b.deadline) return -1
      if (!a.deadline && b.deadline) return 1

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [allTasks, openTasks, completedTasks, overdueTasks, filter, categoryFilter])

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
    setEditingTask(undefined)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleOpenForm = () => {
    setEditingTask(undefined)
    setIsFormOpen(true)
  }

  const filterButtons: { value: FilterType; label: string; count: number; icon?: typeof ListTodo }[] = [
    { value: 'all', label: 'Alle', count: allTasks.length },
    { value: 'open', label: 'Offen', count: openTasks.length, icon: ListTodo },
    { value: 'completed', label: 'Erledigt', count: completedTasks.length, icon: CheckCircle },
    { value: 'overdue', label: 'Überfällig', count: overdueTasks.length, icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Aufgaben</h2>
          <p className="text-sm text-muted-foreground">
            {openTasks.length} offen, {completedTasks.length} erledigt
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="h-4 w-4 mr-2" />
          Aufgabe hinzufügen
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                filter === btn.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {btn.icon && <btn.icon className="h-3.5 w-3.5" />}
              {btn.label}
              {btn.count > 0 && (
                <Badge
                  variant={filter === btn.value ? 'secondary' : 'outline'}
                  className="ml-1 h-5 px-1.5"
                >
                  {btn.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'all')}
            className="h-8 px-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Alle Kategorien</option>
            {(Object.entries(taskCategoryLabels) as [TaskCategory, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {filter === 'all' && categoryFilter === 'all'
              ? 'Noch keine Aufgaben vorhanden'
              : 'Keine Aufgaben für diesen Filter'}
          </p>
          {filter === 'all' && categoryFilter === 'all' && (
            <Button variant="outline" className="mt-4" onClick={handleOpenForm}>
              <Plus className="h-4 w-4 mr-2" />
              Erste Aufgabe erstellen
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTaskStatus}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <TaskForm
        task={editingTask}
        tripId={tripId}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
