export type DocumentType = 'image' | 'pdf' | 'other'
export type DocumentCategory = 'passport' | 'visa' | 'ticket' | 'booking' | 'insurance' | 'other'

export interface TripDocument {
  id: string
  tripId: string
  name: string
  type: DocumentType
  mimeType: string
  size: number
  data: string // Base64 encoded
  category: DocumentCategory
  notes?: string
  uploadedAt: string
}

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  passport: 'Reisepass',
  visa: 'Visum',
  ticket: 'Ticket',
  booking: 'Buchung',
  insurance: 'Versicherung',
  other: 'Sonstiges',
}

export const documentCategoryIcons: Record<DocumentCategory, string> = {
  passport: 'id-card',
  visa: 'stamp',
  ticket: 'ticket',
  booking: 'calendar-check',
  insurance: 'shield-check',
  other: 'file',
}
