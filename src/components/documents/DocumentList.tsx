import { useState, useMemo } from 'react'
import { Plus, FileText, Filter } from 'lucide-react'
import type { TripDocument, DocumentCategory } from '@/types'
import { documentCategoryLabels } from '@/types'
import { useDocumentsStore } from '@/stores'
import { Button, Badge } from '@/components/ui'
import { DocumentCard } from './DocumentCard'
import { DocumentUpload } from './DocumentUpload'
import { DocumentViewer } from './DocumentViewer'

interface DocumentListProps {
  tripId: string
}

export function DocumentList({ tripId }: DocumentListProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<TripDocument | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'all'>('all')

  const { getDocumentsByTrip, addDocument, deleteDocument } = useDocumentsStore()

  const allDocuments = getDocumentsByTrip(tripId)

  const filteredDocuments = useMemo(() => {
    if (categoryFilter === 'all') return allDocuments
    return allDocuments.filter((doc) => doc.category === categoryFilter)
  }, [allDocuments, categoryFilter])

  // Group by category for display
  const documentsByCategory = useMemo(() => {
    const grouped: Record<DocumentCategory, TripDocument[]> = {
      passport: [],
      visa: [],
      ticket: [],
      booking: [],
      insurance: [],
      other: [],
    }

    filteredDocuments.forEach((doc) => {
      grouped[doc.category].push(doc)
    })

    return grouped
  }, [filteredDocuments])

  const handleUpload = (data: Omit<TripDocument, 'id' | 'uploadedAt'>) => {
    addDocument(data)
  }

  const handleView = (doc: TripDocument) => {
    setViewingDocument(doc)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Dokument wirklich löschen?')) {
      deleteDocument(id)
    }
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allDocuments.length }
    allDocuments.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1
    })
    return counts
  }, [allDocuments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Dokumente</h2>
          <p className="text-sm text-muted-foreground">
            {allDocuments.length} Dokument{allDocuments.length !== 1 ? 'e' : ''}
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Dokument hochladen
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <button
          onClick={() => setCategoryFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
            categoryFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Alle
          {categoryCounts.all > 0 && (
            <Badge variant={categoryFilter === 'all' ? 'secondary' : 'outline'} className="ml-1 h-5 px-1.5">
              {categoryCounts.all}
            </Badge>
          )}
        </button>
        {(Object.entries(documentCategoryLabels) as [DocumentCategory, string][]).map(
          ([value, label]) =>
            categoryCounts[value] > 0 && (
              <button
                key={value}
                onClick={() => setCategoryFilter(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  categoryFilter === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {label}
                <Badge variant={categoryFilter === value ? 'secondary' : 'outline'} className="ml-1 h-5 px-1.5">
                  {categoryCounts[value]}
                </Badge>
              </button>
            )
        )}
      </div>

      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {categoryFilter === 'all'
              ? 'Noch keine Dokumente hochgeladen'
              : 'Keine Dokumente in dieser Kategorie'}
          </p>
          {categoryFilter === 'all' && (
            <Button variant="outline" className="mt-4" onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Erstes Dokument hochladen
            </Button>
          )}
        </div>
      ) : categoryFilter === 'all' ? (
        // Show grouped by category
        <div className="space-y-6">
          {(Object.entries(documentsByCategory) as [DocumentCategory, TripDocument[]][])
            .filter(([, docs]) => docs.length > 0)
            .map(([category, docs]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {documentCategoryLabels[category]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {docs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        // Show filtered list
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <DocumentUpload
        tripId={tripId}
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleUpload}
      />

      {/* Viewer Dialog */}
      <DocumentViewer
        document={viewingDocument}
        open={!!viewingDocument}
        onOpenChange={(open) => !open && setViewingDocument(null)}
      />
    </div>
  )
}
