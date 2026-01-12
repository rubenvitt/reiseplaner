import { useParams } from 'react-router-dom'
import { TaskList } from '@/components/tasks'

export function TasksPage() {
  const { tripId } = useParams<{ tripId: string }>()

  if (!tripId) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Keine Reise ausgewählt
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <TaskList tripId={tripId} />
    </div>
  )
}
