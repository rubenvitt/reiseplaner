import { Link } from 'react-router-dom'
import { Calendar, MapPin, Wallet, Pencil, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScaleIn } from '@/components/ui/motion'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Trip, TripStatus } from '@/types'

interface TripCardProps {
  trip: Trip
  onEdit?: () => void
  onDelete?: () => void
  'data-tour'?: string
}

const statusConfig: Record<TripStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  planning: { label: 'Planung', variant: 'secondary' },
  upcoming: { label: 'Bevorstehend', variant: 'outline' },
  ongoing: { label: 'Aktiv', variant: 'default' },
  completed: { label: 'Abgeschlossen', variant: 'secondary' },
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function TripCard({ trip, onEdit, onDelete, 'data-tour': dataTour }: TripCardProps) {
  const statusInfo = statusConfig[trip.status]
  const hasActions = onEdit || onDelete

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <Link to={`/trip/${trip.id}`} data-tour={dataTour}>
      <Card className="h-full cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">{trip.name}</CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {trip.description && (
            <p className="text-sm text-muted-foreground">
              {truncateText(trip.description, 100)}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {trip.destinations.length}{' '}
              {trip.destinations.length === 1 ? 'Reiseziel' : 'Reiseziele'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>{formatCurrency(trip.totalBudget, trip.currency)}</span>
          </div>

          {hasActions && (
            <ScaleIn delay={0.1}>
              <div className="flex items-center gap-2 pt-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="flex-1"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Löschen
                  </Button>
                )}
              </div>
            </ScaleIn>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
