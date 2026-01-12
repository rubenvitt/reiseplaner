import { useCallback, useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'
import type { DocumentCategory, TripDocument } from '@/types'
import { documentCategoryLabels } from '@/types'
import {
  fileToBase64,
  validateFileSize,
  getDocumentType,
  getFileSizeFormatted,
  compressImage,
  isImageFile,
  getAcceptedFileTypes,
} from '@/lib/documentUtils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
} from '@/components/ui'

interface DocumentUploadProps {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (doc: Omit<TripDocument, 'id' | 'uploadedAt'>) => void
}

export function DocumentUpload({ tripId, open, onOpenChange, onUpload }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<DocumentCategory>('other')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setName('')
    setCategory('other')
    setNotes('')
    setError(null)
    setIsUploading(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleFileSelect = async (selectedFile: File) => {
    setError(null)

    if (!validateFileSize(selectedFile, 5)) {
      setError('Datei ist zu groß. Maximal 5 MB erlaubt.')
      return
    }

    setFile(selectedFile)
    setName(selectedFile.name)

    // Create preview for images
    if (isImageFile(selectedFile.type)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Bitte wähle eine Datei aus.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      let base64Data = await fileToBase64(file)
      let finalSize = file.size

      // Compress images
      if (isImageFile(file.type)) {
        try {
          base64Data = await compressImage(base64Data, file.type, 1200, 0.8)
          finalSize = Math.ceil(base64Data.length * 0.75) // Approximate size after base64 encoding
        } catch {
          // Use original if compression fails
        }
      }

      onUpload({
        tripId,
        name: name || file.name,
        type: getDocumentType(file.type),
        mimeType: file.type,
        size: finalSize,
        data: base64Data,
        category,
        notes: notes || undefined,
      })

      handleClose()
    } catch {
      setError('Fehler beim Hochladen der Datei.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dokument hochladen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Datei hier ablegen oder
              </p>
              <label className="cursor-pointer">
                <span className="text-sm text-primary hover:underline">
                  Datei auswählen
                </span>
                <input
                  type="file"
                  accept={getAcceptedFileTypes()}
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Bilder oder PDF, maximal 5 MB
              </p>
            </div>
          ) : (
            <div className="relative bg-muted rounded-lg p-4">
              <button
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  setName('')
                }}
                className="absolute top-2 right-2 p-1 bg-background rounded-full hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>

              {preview ? (
                <img
                  src={preview}
                  alt="Vorschau"
                  className="max-h-40 mx-auto rounded"
                />
              ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground">
                  <span className="text-sm">{file.name}</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center mt-2">
                {getFileSizeFormatted(file.size)}
              </p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dokumentname"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.entries(documentCategoryLabels) as [DocumentCategory, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[60px] px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Optionale Notizen..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isUploading}>
            {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
