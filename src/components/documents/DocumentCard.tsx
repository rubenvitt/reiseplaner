import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  Eye,
  MoreVertical,
} from 'lucide-react'
import { useState } from 'react'
import type { TripDocument } from '@/types'
import { documentCategoryLabels } from '@/types'
import { getFileSizeFormatted, base64ToDataUrl } from '@/lib/documentUtils'
import { Badge, Button } from '@/components/ui'

interface DocumentCardProps {
  document: TripDocument
  onView: (doc: TripDocument) => void
  onDelete: (id: string) => void
}

export function DocumentCard({ document, onView, onDelete }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getIcon = () => {
    switch (document.type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      case 'pdf':
        return <FileText className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const handleDownload = () => {
    const dataUrl = base64ToDataUrl(document.data, document.mimeType)
    const link = window.document.createElement('a')
    link.href = dataUrl
    link.download = document.name
    link.click()
    setShowMenu(false)
  }

  const handleView = () => {
    onView(document)
    setShowMenu(false)
  }

  const handleDelete = () => {
    onDelete(document.id)
    setShowMenu(false)
  }

  return (
    <div className="group relative bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Preview Thumbnail */}
        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {document.type === 'image' ? (
            <img
              src={base64ToDataUrl(document.data, document.mimeType)}
              alt={document.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground">{getIcon()}</div>
          )}
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate" title={document.name}>
            {document.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {documentCategoryLabels[document.category]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {getFileSizeFormatted(document.size)}
            </span>
          </div>
          {document.notes && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {document.notes}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Hochgeladen: {format(new Date(document.uploadedAt), 'dd. MMM yyyy', { locale: de })}
          </p>
        </div>

        {/* Actions */}
        <div className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-40 bg-popover border border-border rounded-lg shadow-lg py-1">
                <button
                  onClick={handleView}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                >
                  <Eye className="h-4 w-4" />
                  Anzeigen
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                >
                  <Download className="h-4 w-4" />
                  Herunterladen
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
