import { useMemo } from 'react'
import { MapPin, Calendar, Pencil, Trash2, Home, Activity } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { useAccommodationStore } from '@/stores/accommodationStore'
import { useItineraryStore } from '@/stores/itineraryStore'
import type { Destination } from '@/types'

interface DestinationCardProps {
  destination: Destination
  index: number
  onEdit?: () => void
  onDelete?: () => void
}

export function DestinationCard({
  destination,
  index,
  onEdit,
  onDelete,
}: DestinationCardProps) {
  const { name, country, arrivalDate, departureDate, notes } = destination

  // Statistiken laden - mit stabilen Selektoren
  const accommodations = useAccommodationStore((state) => state.accommodations)
  const dayPlans = useItineraryStore((state) => state.dayPlans)

  const accommodationCount = useMemo(
    () => accommodations.filter((a) => a.destinationId === destination.id).length,
    [accommodations, destination.id]
  )

  const activityCount = useMemo(() => {
    return dayPlans
      .filter((dp) => dp.destinationId === destination.id)
      .reduce((sum, dp) => sum + dp.activities.length, 0)
  }, [dayPlans, destination.id])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(arrivalDate)} - {formatDate(departureDate)}
          </span>
        </div>

        {(accommodationCount > 0 || activityCount > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {accommodationCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                {accommodationCount} {accommodationCount === 1 ? 'Unterkunft' : 'Unterkünfte'}
              </Badge>
            )}
            {activityCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {activityCount} {activityCount === 1 ? 'Aktivität' : 'Aktivitäten'}
              </Badge>
            )}
          </div>
        )}

        {notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{notes}</p>
        )}

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2 pt-3 border-t">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="mr-1 h-4 w-4" />
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Löschen
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
