import { useForm } from 'react-hook-form'
import type { Task, TaskCategory, TaskPriority } from '@/types'
import { taskCategoryLabels, taskPriorityLabels } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
} from '@/components/ui'

interface TaskFormData {
  title: string
  description: string
  deadline: string
  priority: TaskPriority
  category: TaskCategory
}

interface TaskFormProps {
  task?: Task
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void
}

export function TaskForm({ task, tripId, open, onOpenChange, onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      deadline: task?.deadline?.split('T')[0] || '',
      priority: task?.priority || 'medium',
      category: task?.category || 'other',
    },
  })

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      tripId,
      title: data.title,
      description: data.description || undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      priority: data.priority,
      category: data.category,
      status: task?.status || 'open',
    })
    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Titel *
            </label>
            <Input
              {...register('title', { required: 'Titel ist erforderlich' })}
              placeholder="z.B. Flug buchen"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Beschreibung
            </label>
            <textarea
              {...register('description')}
              className="w-full min-h-[80px] px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Optionale Details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Fälligkeitsdatum
              </label>
              <Input type="date" {...register('deadline')} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Priorität
              </label>
              <select
                {...register('priority')}
                className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {(Object.entries(taskPriorityLabels) as [TaskPriority, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Kategorie
            </label>
            <select
              {...register('category')}
              className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.entries(taskCategoryLabels) as [TaskCategory, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button type="submit">
              {task ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
