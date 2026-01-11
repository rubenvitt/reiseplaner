import { useState, useRef } from 'react'
import { Download, Upload, AlertTriangle, Check, X, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Button,
  Card,
  CardContent,
} from '@/components/ui'
import { exportAllData, downloadAsJson } from '@/lib/export'
import {
  validateImportData,
  importData,
  type ImportOptions,
  type ExportData,
} from '@/lib/import'

type ImportMode = 'merge' | 'replace'

interface ImportPreview {
  tripCount: number
  dayPlanCount: number
  accommodationCount: number
  expenseCount: number
  packingListCount: number
}

type ImportStep = 'select' | 'options' | 'confirm' | 'result'

interface ImportState {
  step: ImportStep
  file: File | null
  data: ExportData | null
  preview: ImportPreview | null
  mode: ImportMode
  error: string | null
  success: boolean
}

export function ExportImport() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importState, setImportState] = useState<ImportState>({
    step: 'select',
    file: null,
    data: null,
    preview: null,
    mode: 'merge',
    error: null,
    success: false,
  })

  // Reset import state when dialog closes
  const resetImportState = () => {
    setImportState({
      step: 'select',
      file: null,
      data: null,
      preview: null,
      mode: 'merge',
      error: null,
      success: false,
    })
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      resetImportState()
    }
  }

  // Export handler
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = exportAllData()
      const filename = `reiseplaner-backup-${new Date().toISOString().split('T')[0]}.json`
      downloadAsJson(data, filename)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Trigger file input
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // File selection handler
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset file input for next selection
    event.target.value = ''

    setIsImporting(true)
    setDialogOpen(true)

    try {
      const content = await file.text()
      const jsonData = JSON.parse(content)

      // Validate the data
      const validation = validateImportData(jsonData)

      if (!validation.success || !validation.data) {
        setImportState({
          step: 'result',
          file,
          data: null,
          preview: null,
          mode: 'merge',
          error: validation.error || 'Ungueltige Importdatei',
          success: false,
        })
        return
      }

      // Create preview
      const data = validation.data
      const preview: ImportPreview = {
        tripCount: data.data.trips.length,
        dayPlanCount: data.data.dayPlans.length,
        accommodationCount: data.data.accommodations.length,
        expenseCount: data.data.expenses.length,
        packingListCount: data.data.packingLists.length,
      }

      setImportState({
        step: 'options',
        file,
        data: validation.data,
        preview,
        mode: 'merge',
        error: null,
        success: false,
      })
    } catch {
      setImportState({
        step: 'result',
        file,
        data: null,
        preview: null,
        mode: 'merge',
        error: 'Die Datei konnte nicht gelesen werden. Bitte stellen Sie sicher, dass es sich um eine gueltige JSON-Datei handelt.',
        success: false,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Mode selection handler
  const handleModeChange = (mode: ImportMode) => {
    setImportState((prev) => ({ ...prev, mode }))
  }

  // Proceed to confirmation for replace mode
  const handleProceed = () => {
    if (importState.mode === 'replace') {
      setImportState((prev) => ({ ...prev, step: 'confirm' }))
    } else {
      handleImport()
    }
  }

  // Perform the actual import
  const handleImport = () => {
    if (!importState.data) return

    setIsImporting(true)

    try {
      const options: ImportOptions = {
        merge: importState.mode === 'merge',
      }

      const result = importData(importState.data, options)

      if (result.success) {
        setImportState((prev) => ({
          ...prev,
          step: 'result',
          success: true,
          error: null,
        }))
      } else {
        setImportState((prev) => ({
          ...prev,
          step: 'result',
          success: false,
          error: result.error || 'Import fehlgeschlagen',
        }))
      }
    } catch {
      setImportState((prev) => ({
        ...prev,
        step: 'result',
        success: false,
        error: 'Ein unerwarteter Fehler ist aufgetreten',
      }))
    } finally {
      setIsImporting(false)
    }
  }

  // Go back to options
  const handleBack = () => {
    setImportState((prev) => ({ ...prev, step: 'options' }))
  }

  // Render dialog content based on step
  const renderDialogContent = () => {
    switch (importState.step) {
      case 'options':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Daten importieren</DialogTitle>
              <DialogDescription>
                Waehlen Sie, wie die Daten importiert werden sollen.
              </DialogDescription>
            </DialogHeader>

            {/* Preview Card */}
            {importState.preview && (
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <h4 className="text-sm font-medium mb-3">Vorschau der Importdaten:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reisen:</span>
                      <span className="font-medium">{importState.preview.tripCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tagesplaene:</span>
                      <span className="font-medium">{importState.preview.dayPlanCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unterkuenfte:</span>
                      <span className="font-medium">{importState.preview.accommodationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ausgaben:</span>
                      <span className="font-medium">{importState.preview.expenseCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packlisten:</span>
                      <span className="font-medium">{importState.preview.packingListCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Mode Selection */}
            <div className="mt-6 space-y-3">
              <label className="text-sm font-medium">Import-Modus:</label>

              {/* Merge Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  importState.mode === 'merge'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importState.mode === 'merge'}
                  onChange={() => handleModeChange('merge')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Daten zusammenfuehren</div>
                  <p className="text-sm text-muted-foreground">
                    Fuegt neue Daten hinzu, ohne bestehende zu ueberschreiben. Duplikate werden uebersprungen.
                  </p>
                </div>
              </label>

              {/* Replace Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  importState.mode === 'replace'
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-destructive/50'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importState.mode === 'replace'}
                  onChange={() => handleModeChange('replace')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Alle Daten ersetzen</div>
                  <p className="text-sm text-muted-foreground">
                    Loescht alle bestehenden Daten und ersetzt sie durch die importierten.
                  </p>
                </div>
              </label>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => handleDialogChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleProceed} disabled={isImporting}>
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {importState.mode === 'replace' ? 'Weiter' : 'Importieren'}
              </Button>
            </DialogFooter>
          </>
        )

      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Alle Daten ersetzen?
              </DialogTitle>
              <DialogDescription>
                Diese Aktion kann nicht rueckgaengig gemacht werden.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm">
                Wenn Sie fortfahren, werden <strong>alle bestehenden Daten geloescht</strong> und durch die importierten Daten ersetzt:
              </p>
              <ul className="mt-2 text-sm list-disc list-inside text-muted-foreground">
                <li>Alle Reisen und Ziele</li>
                <li>Alle Tagesplaene und Aktivitaeten</li>
                <li>Alle Unterkuenfte</li>
                <li>Alle Ausgaben</li>
                <li>Alle Packlisten</li>
              </ul>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleBack}>
                Zurueck
              </Button>
              <Button variant="destructive" onClick={handleImport} disabled={isImporting}>
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ja, alle Daten ersetzen
              </Button>
            </DialogFooter>
          </>
        )

      case 'result':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {importState.success ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    Import erfolgreich
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-destructive" />
                    Import fehlgeschlagen
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              {importState.success ? (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm">
                    Die Daten wurden erfolgreich importiert. Die Aenderungen sind sofort sichtbar.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm text-destructive">{importState.error}</p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={() => handleDialogChange(false)}>
                Schliessen
              </Button>
            </DialogFooter>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex gap-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Alle Daten exportieren
      </Button>

      {/* Import Button */}
      <Button
        variant="outline"
        onClick={handleImportClick}
        disabled={isImporting}
      >
        {isImporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Daten importieren
      </Button>

      {/* Import Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
