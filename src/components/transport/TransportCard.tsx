import {
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Footprints,
  Bike,
  CircleDot,
  MapPin,
  Calendar,
  Clock,
  Wallet,
  Check,
  X,
  Pencil,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Transport, TransportMode } from '@/types'

interface TransportCardProps {
  transport: Transport
  onEdit?: () => void
  onDelete?: () => void
  onTogglePaid?: () => void
}

const TRANSPORT_ICONS: Record<TransportMode, LucideIcon> = {
  flight: Plane,
  train: Train,
  car: Car,
  bus: Bus,
  ferry: Ship,
  taxi: Car,
  walking: Footprints,
  bicycle: Bike,
  other: CircleDot,
}

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  flight: 'Flug',
  train: 'Zug',
  car: 'Auto',
  bus: 'Bus',
  ferry: 'Fähre',
  taxi: 'Taxi/Uber',
  walking: 'Zu Fuß',
  bicycle: 'Fahrrad',
  other: 'Sonstiges',
}

function calculateDuration(
  departureDate: string,
  departureTime: string | undefined,
  arrivalDate: string,
  arrivalTime: string | undefined
): string | null {
  if (!departureTime || !arrivalTime) return null

  const departure = new Date(`${departureDate}T${departureTime}`)
  const arrival = new Date(`${arrivalDate}T${arrivalTime}`)

  const diffMs = arrival.getTime() - departure.getTime()
  if (diffMs < 0) return null

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours > 0 && diffMinutes > 0) {
    return `${diffHours}h ${diffMinutes}min`
  } else if (diffHours > 0) {
    return `${diffHours}h`
  } else {
    return `${diffMinutes}min`
  }
}

export function TransportCard({
  transport,
  onEdit,
  onDelete,
  onTogglePaid,
}: TransportCardProps) {
  const {
    mode,
    origin,
    destination,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime,
    price,
    currency,
    isPaid,
    bookingReference,
    details,
    notes,
  } = transport

  const Icon = TRANSPORT_ICONS[mode]
  const duration = calculateDuration(departureDate, departureTime, arrivalDate, arrivalTime)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {origin.name} <ArrowRight className="inline h-4 w-4 mx-1" /> {destination.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{TRANSPORT_LABELS[mode]}</Badge>
            {price !== undefined && price > 0 && (
              <Badge
                className={
                  isPaid
                    ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                    : 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                }
              >
                {isPaid ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Bezahlt
                  </>
                ) : (
                  <>
                    <X className="mr-1 h-3 w-3" />
                    Offen
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Route Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Abfahrt</span>
            </div>
            <div className="pl-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(departureDate)}</span>
              </div>
              {departureTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{departureTime} Uhr</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Ankunft</span>
            </div>
            <div className="pl-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(arrivalDate)}</span>
              </div>
              {arrivalTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{arrivalTime} Uhr</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Duration */}
        {duration && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Dauer:</span> {duration}
          </div>
        )}

        {/* Price */}
        {price !== undefined && price > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span>{formatCurrency(price, currency)}</span>
          </div>
        )}

        {/* Booking Reference */}
        {bookingReference && (
          <div className="text-sm">
            <span className="text-muted-foreground">Buchungsnummer: </span>
            <span className="font-mono">{bookingReference}</span>
          </div>
        )}

        {/* Transport-specific Details */}
        {details && (
          <div className="text-sm space-y-1 pt-2 border-t">
            {mode === 'flight' && (
              <>
                {details.flightNumber && (
                  <div>
                    <span className="text-muted-foreground">Flugnummer: </span>
                    <span className="font-mono">{details.flightNumber}</span>
                  </div>
                )}
                {details.airline && (
                  <div>
                    <span className="text-muted-foreground">Airline: </span>
                    <span>{details.airline}</span>
                  </div>
                )}
                {details.terminal && (
                  <div>
                    <span className="text-muted-foreground">Terminal: </span>
                    <span>{details.terminal}</span>
                  </div>
                )}
                {details.gate && (
                  <div>
                    <span className="text-muted-foreground">Gate: </span>
                    <span>{details.gate}</span>
                  </div>
                )}
              </>
            )}
            {mode === 'train' && (
              <>
                {details.trainNumber && (
                  <div>
                    <span className="text-muted-foreground">Zugnummer: </span>
                    <span className="font-mono">{details.trainNumber}</span>
                  </div>
                )}
                {details.carrier && (
                  <div>
                    <span className="text-muted-foreground">Anbieter: </span>
                    <span>{details.carrier}</span>
                  </div>
                )}
                {details.platform && (
                  <div>
                    <span className="text-muted-foreground">Gleis: </span>
                    <span>{details.platform}</span>
                  </div>
                )}
                {details.wagon && (
                  <div>
                    <span className="text-muted-foreground">Wagen: </span>
                    <span>{details.wagon}</span>
                  </div>
                )}
                {details.seat && (
                  <div>
                    <span className="text-muted-foreground">Sitzplatz: </span>
                    <span>{details.seat}</span>
                  </div>
                )}
              </>
            )}
            {mode === 'car' && (
              <>
                {details.vehicleInfo && (
                  <div>
                    <span className="text-muted-foreground">Fahrzeug: </span>
                    <span>{details.vehicleInfo}</span>
                  </div>
                )}
                {details.licensePlate && (
                  <div>
                    <span className="text-muted-foreground">Kennzeichen: </span>
                    <span className="font-mono">{details.licensePlate}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="text-sm pt-2 border-t">
            <span className="text-muted-foreground">Notizen: </span>
            <span>{notes}</span>
          </div>
        )}

        {/* Actions */}
        {(onEdit || onDelete || onTogglePaid) && (
          <div className="flex items-center gap-2 pt-3 border-t">
            {onTogglePaid && price !== undefined && price > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePaid}
                className={isPaid ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'}
              >
                {isPaid ? (
                  <>
                    <X className="mr-1 h-4 w-4" />
                    Als offen markieren
                  </>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Als bezahlt markieren
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="mr-1 h-4 w-4" />
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
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
