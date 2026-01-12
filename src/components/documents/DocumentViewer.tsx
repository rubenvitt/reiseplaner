import { X, Download, ExternalLink } from 'lucide-react'
import type { TripDocument } from '@/types'
import { base64ToDataUrl } from '@/lib/documentUtils'
import { Dialog, DialogContent, Button } from '@/components/ui'

interface DocumentViewerProps {
  document: TripDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
  if (!document) return null

  const dataUrl = base64ToDataUrl(document.data, document.mimeType)

  const handleDownload = () => {
    const link = window.document.createElement('a')
    link.href = dataUrl
    link.download = document.name
    link.click()
  }

  const handleOpenInNewTab = () => {
    window.open(dataUrl, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground truncate pr-4">
            {document.name}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              In neuem Tab
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Herunterladen
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0 flex items-center justify-center p-4 bg-muted/50 rounded-lg">
          {document.type === 'image' ? (
            <img
              src={dataUrl}
              alt={document.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : document.type === 'pdf' ? (
            <iframe
              src={dataUrl}
              title={document.name}
              className="w-full h-full min-h-[500px] border-0 rounded"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Vorschau nicht verfügbar</p>
              <Button variant="outline" className="mt-4" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Herunterladen
              </Button>
            </div>
          )}
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Notizen:</strong> {document.notes}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
