import {
  Building2,
  MapPin,
  Calendar,
  Wallet,
  Check,
  X,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Globe,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Accommodation, AccommodationType } from '@/types'

interface AccommodationCardProps {
  accommodation: Accommodation
  onEdit?: () => void
  onDelete?: () => void
  onTogglePaid?: () => void
}

const accommodationTypeLabels: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  airbnb: 'Airbnb',
  hostel: 'Hostel',
  apartment: 'Apartment',
  camping: 'Camping',
  other: 'Sonstige',
}

export function AccommodationCard({
  accommodation,
  onEdit,
  onDelete,
  onTogglePaid,
}: AccommodationCardProps) {
  const {
    name,
    type,
    address,
    checkIn,
    checkOut,
    price,
    currency,
    isPaid,
    confirmationNumber,
    contactInfo,
  } = accommodation

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{accommodationTypeLabels[type]}</Badge>
            <Badge
              className={
                isPaid
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(checkIn)} - {formatDate(checkOut)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span>{formatCurrency(price, currency)}</span>
        </div>

        {confirmationNumber && (
          <div className="text-sm">
            <span className="text-muted-foreground">Bestätigungsnummer: </span>
            <span className="font-mono">{confirmationNumber}</span>
          </div>
        )}

        {contactInfo && (contactInfo.phone || contactInfo.email || contactInfo.website) && (
          <div className="flex flex-wrap gap-3 pt-2 border-t">
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{contactInfo.email}</span>
              </a>
            )}
            {contactInfo.website && (
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
          </div>
        )}

        {(onEdit || onDelete || onTogglePaid) && (
          <div className="flex items-center gap-2 pt-3 border-t">
            {onTogglePaid && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePaid}
                className={isPaid ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
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
