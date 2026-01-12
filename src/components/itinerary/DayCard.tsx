import { useState } from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { ActivityItem } from './ActivityItem'
import { ActivityForm, type ActivityFormData } from './ActivityForm'
import { useItineraryStore } from '@/stores'
import type { DayPlan, Activity } from '@/types'

interface DayCardProps {
  dayPlan: DayPlan
  date: string
  destinationName?: string
}

export function DayCard({ dayPlan, date, destinationName }: DayCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const { addActivity, updateActivity, deleteActivity, toggleActivityCompleted } =
    useItineraryStore()

  const formattedDate = format(parseISO(date), 'EEEE, d. MMMM yyyy', {
    locale: de,
  })

  const sortedActivities = [...dayPlan.activities].sort(
    (a, b) => a.order - b.order
  )

  const activityIds = sortedActivities.map((activity) => activity.id)

  const handleAddActivity = (data: ActivityFormData) => {
    addActivity(dayPlan.id, {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      category: data.category,
      cost: data.cost,
      bookingReference: data.bookingReference,
      isCompleted: false,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditActivity = (data: ActivityFormData) => {
    if (!editingActivity) return
    updateActivity(dayPlan.id, editingActivity.id, {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      category: data.category,
      cost: data.cost,
      bookingReference: data.bookingReference,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    setEditingActivity(null)
  }

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Möchten Sie diese Aktivität wirklich löschen?')) {
      deleteActivity(dayPlan.id, activityId)
    }
  }

  const handleToggleComplete = (activityId: string) => {
    toggleActivityCompleted(dayPlan.id, activityId)
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base capitalize">{formattedDate}</CardTitle>
          {destinationName && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {destinationName}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <SortableContext
          items={activityIds}
          strategy={verticalListSortingStrategy}
        >
          {sortedActivities.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Noch keine Aktivitäten geplant
            </p>
          ) : (
            sortedActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onEdit={() => setEditingActivity(activity)}
                onDelete={() => handleDeleteActivity(activity.id)}
                onToggleComplete={() => handleToggleComplete(activity.id)}
              />
            ))
          )}
        </SortableContext>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Aktivität hinzufügen
        </Button>

        {/* Add Activity Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Aktivität</DialogTitle>
            </DialogHeader>
            <ActivityForm
              onSubmit={handleAddActivity}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Activity Dialog */}
        <Dialog
          open={editingActivity !== null}
          onOpenChange={(open) => !open && setEditingActivity(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aktivität bearbeiten</DialogTitle>
            </DialogHeader>
            {editingActivity && (
              <ActivityForm
                activity={editingActivity}
                onSubmit={handleEditActivity}
                onCancel={() => setEditingActivity(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
