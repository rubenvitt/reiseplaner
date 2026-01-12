import { saveAs } from 'file-saver'
import {
  useTripStore,
  useItineraryStore,
  useAccommodationStore,
  useBudgetStore,
  usePackingStore,
  useTransportStore,
  useTasksStore,
  useDocumentsStore,
} from '@/stores'
import type { Trip, DayPlan, Accommodation, Expense, PackingList, Transport, Task, TripDocument } from '@/types'

/**
 * Export data structure with version information
 */
export interface ExportData {
  version: string
  exportedAt: string
  data: {
    trips: Trip[]
    dayPlans: DayPlan[]
    accommodations: Accommodation[]
    expenses: Expense[]
    packingLists: PackingList[]
    transports: Transport[]
    tasks: Task[]
    documents: TripDocument[]
  }
}

const EXPORT_VERSION = '1.3.0'

/**
 * Downloads data as a JSON file
 */
export function downloadAsJson(data: unknown, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  saveAs(blob, filename)
}

/**
 * Exports all data from all stores
 */
export function exportAllData(): ExportData {
  const trips = useTripStore.getState().trips
  const dayPlans = useItineraryStore.getState().dayPlans
  const accommodations = useAccommodationStore.getState().accommodations
  const expenses = useBudgetStore.getState().expenses
  const packingLists = usePackingStore.getState().packingLists
  const transports = useTransportStore.getState().transports
  const tasks = useTasksStore.getState().tasks
  const documents = useDocumentsStore.getState().documents

  const exportData: ExportData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      trips,
      dayPlans,
      accommodations,
      expenses,
      packingLists,
      transports,
      tasks,
      documents,
    },
  }

  return exportData
}

/**
 * Exports a single trip with all related data
 */
export function exportTrip(tripId: string): ExportData | null {
  const trips = useTripStore.getState().trips
  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return null
  }

  const dayPlans = useItineraryStore
    .getState()
    .dayPlans.filter((dp) => dp.tripId === tripId)

  const accommodations = useAccommodationStore
    .getState()
    .accommodations.filter((a) => a.tripId === tripId)

  const expenses = useBudgetStore
    .getState()
    .expenses.filter((e) => e.tripId === tripId)

  const packingLists = usePackingStore
    .getState()
    .packingLists.filter((pl) => pl.tripId === tripId)

  const transports = useTransportStore
    .getState()
    .transports.filter((t) => t.tripId === tripId)

  const tasks = useTasksStore
    .getState()
    .tasks.filter((t) => t.tripId === tripId)

  const documents = useDocumentsStore
    .getState()
    .documents.filter((d) => d.tripId === tripId)

  const exportData: ExportData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      trips: [trip],
      dayPlans,
      accommodations,
      expenses,
      packingLists,
      transports,
      tasks,
      documents,
    },
  }

  return exportData
}

/**
 * Helper function to export all data and download it
 */
export function downloadAllData(filename?: string): void {
  const data = exportAllData()
  const defaultFilename = `reiseplaner-backup-${new Date().toISOString().split('T')[0]}.json`
  downloadAsJson(data, filename ?? defaultFilename)
}

/**
 * Helper function to export a single trip and download it
 */
export function downloadTrip(tripId: string, filename?: string): void {
  const data = exportTrip(tripId)

  if (!data) {
    console.error(`Trip with id "${tripId}" not found`)
    return
  }

  const trip = data.data.trips[0]
  const safeTripName = trip.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
  const defaultFilename = `reiseplaner-${safeTripName}-${new Date().toISOString().split('T')[0]}.json`
  downloadAsJson(data, filename ?? defaultFilename)
}
