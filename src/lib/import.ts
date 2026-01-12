import { z } from 'zod'
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
// Types are only used via Zod schemas, so no direct type imports needed

// ============================================================================
// Zod Schemas
// ============================================================================

// Trip Status Schema
const TripStatusSchema = z.enum(['planning', 'upcoming', 'ongoing', 'completed'])

// Activity Category Schema
const ActivityCategorySchema = z.enum([
  'sightseeing',
  'food',
  'transport',
  'activity',
  'relaxation',
  'shopping',
  'other',
])

// Accommodation Type Schema
const AccommodationTypeSchema = z.enum([
  'hotel',
  'airbnb',
  'hostel',
  'apartment',
  'camping',
  'other',
])

// Expense Category Schema
const ExpenseCategorySchema = z.enum([
  'accommodation',
  'transport',
  'food',
  'activities',
  'shopping',
  'insurance',
  'visa',
  'other',
])

// Payment Method Schema
const PaymentMethodSchema = z.enum([
  'cash',
  'credit_card',
  'debit_card',
  'paypal',
  'other',
])

// Destination Schema
const DestinationSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  name: z.string(),
  country: z.string(),
  arrivalDate: z.string(),
  departureDate: z.string(),
  order: z.number(),
  notes: z.string().optional(),
})

// Trip Schema
const TripSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  coverImage: z.string().optional(),
  destinations: z.array(DestinationSchema),
  status: TripStatusSchema,
  currency: z.string(),
  totalBudget: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Activity Schema
const ActivitySchema = z.object({
  id: z.string(),
  dayId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  category: ActivityCategorySchema,
  order: z.number(),
  isCompleted: z.boolean(),
  cost: z.number().optional(),
  bookingReference: z.string().optional(),
})

// DayPlan Schema
const DayPlanSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  date: z.string(),
  destinationId: z.string().optional(),
  activities: z.array(ActivitySchema),
  notes: z.string().optional(),
})

// Contact Info Schema
const ContactInfoSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
})

// Accommodation Schema
const AccommodationSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  destinationId: z.string().optional(),
  name: z.string(),
  type: AccommodationTypeSchema,
  address: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  confirmationNumber: z.string().optional(),
  price: z.number(),
  currency: z.string(),
  isPaid: z.boolean(),
  contactInfo: ContactInfoSchema.optional(),
  notes: z.string().optional(),
  amenities: z.array(z.string()).optional(),
})

// Expense Schema
const ExpenseSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayId: z.string().optional(),
  title: z.string(),
  amount: z.number(),
  currency: z.string(),
  category: ExpenseCategorySchema,
  date: z.string(),
  paymentMethod: PaymentMethodSchema.optional(),
  notes: z.string().optional(),
  isReimbursable: z.boolean(),
  createdAt: z.string(),
})

// Packing Item Schema
const PackingItemSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string(),
  quantity: z.number(),
  isPacked: z.boolean(),
  isEssential: z.boolean(),
  notes: z.string().optional(),
  order: z.number(),
})

// Packing Category Schema
const PackingCategorySchema = z.object({
  id: z.string(),
  listId: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  order: z.number(),
  items: z.array(PackingItemSchema),
})

// Packing List Schema
const PackingListSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  name: z.string(),
  categories: z.array(PackingCategorySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Transport Mode Schema
const TransportModeSchema = z.enum([
  'car',
  'train',
  'flight',
  'bus',
  'ferry',
  'taxi',
  'walking',
  'bicycle',
  'other',
])

// Transport Location Schema
const TransportLocationSchema = z.object({
  destinationId: z.string().optional(),
  name: z.string(),
  address: z.string().optional(),
})

// Transport Details Schema
const TransportDetailsSchema = z.object({
  flightNumber: z.string().optional(),
  airline: z.string().optional(),
  terminal: z.string().optional(),
  gate: z.string().optional(),
  trainNumber: z.string().optional(),
  carrier: z.string().optional(),
  wagon: z.string().optional(),
  seat: z.string().optional(),
  platform: z.string().optional(),
  vehicleInfo: z.string().optional(),
  licensePlate: z.string().optional(),
}).optional()

// Transport Schema
const TransportSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  mode: TransportModeSchema,
  origin: TransportLocationSchema,
  destination: TransportLocationSchema,
  departureDate: z.string(),
  departureTime: z.string().optional(),
  arrivalDate: z.string(),
  arrivalTime: z.string().optional(),
  bookingReference: z.string().optional(),
  price: z.number().optional(),
  currency: z.string(),
  isPaid: z.boolean(),
  details: TransportDetailsSchema,
  notes: z.string().optional(),
})

// Task Status Schema
const TaskStatusSchema = z.enum(['open', 'completed'])

// Task Priority Schema
const TaskPrioritySchema = z.enum(['low', 'medium', 'high'])

// Task Category Schema
const TaskCategorySchema = z.enum([
  'booking',
  'documents',
  'packing',
  'finance',
  'health',
  'other',
])

// Task Schema
const TaskSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  category: TaskCategorySchema,
  createdAt: z.string(),
  completedAt: z.string().optional(),
})

// Document Type Schema
const DocumentTypeSchema = z.enum(['image', 'pdf', 'other'])

// Document Category Schema
const DocumentCategorySchema = z.enum([
  'passport',
  'visa',
  'ticket',
  'booking',
  'insurance',
  'other',
])

// Document Schema
const TripDocumentSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  name: z.string(),
  type: DocumentTypeSchema,
  mimeType: z.string(),
  size: z.number(),
  data: z.string(),
  category: DocumentCategorySchema,
  notes: z.string().optional(),
  uploadedAt: z.string(),
})

// Export Data Schema (main import format)
const ExportDataSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  data: z.object({
    trips: z.array(TripSchema),
    dayPlans: z.array(DayPlanSchema),
    accommodations: z.array(AccommodationSchema),
    expenses: z.array(ExpenseSchema),
    packingLists: z.array(PackingListSchema),
    transports: z.array(TransportSchema).optional().default([]),
    tasks: z.array(TaskSchema).optional().default([]),
    documents: z.array(TripDocumentSchema).optional().default([]),
  }),
})

// ============================================================================
// Types
// ============================================================================

export type ExportData = z.infer<typeof ExportDataSchema>

export interface ImportOptions {
  merge: boolean // true = add to existing, false = replace all
}

export interface ImportResult {
  success: boolean
  error?: string
  importedCounts?: {
    trips: number
    destinations: number
    dayPlans: number
    activities: number
    accommodations: number
    expenses: number
    packingLists: number
    packingCategories: number
    packingItems: number
    transports: number
    tasks: number
    documents: number
  }
}

// ============================================================================
// Validation Function
// ============================================================================

export function validateImportData(data: unknown): {
  success: boolean
  data?: ExportData
  error?: string
} {
  try {
    const parsed = ExportDataSchema.parse(data)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        const path = issue.path.join('.')
        return `${path}: ${issue.message}`
      })
      return {
        success: false,
        error: `Validierungsfehler:\n${issues.join('\n')}`,
      }
    }
    return {
      success: false,
      error: 'Unbekannter Fehler bei der Validierung der Importdaten.',
    }
  }
}

// ============================================================================
// Import Function
// ============================================================================

export function importData(
  data: ExportData,
  options: ImportOptions
): ImportResult {
  try {
    const { merge } = options
    const { trips, dayPlans, accommodations, expenses, packingLists, transports = [], tasks = [], documents = [] } = data.data

    // Get store states
    const tripStore = useTripStore.getState()
    const itineraryStore = useItineraryStore.getState()
    const accommodationStore = useAccommodationStore.getState()
    const budgetStore = useBudgetStore.getState()
    const packingStore = usePackingStore.getState()
    const transportStore = useTransportStore.getState()
    const tasksStore = useTasksStore.getState()
    const documentsStore = useDocumentsStore.getState()

    // Count items for result
    let destinationsCount = 0
    let activitiesCount = 0
    let packingCategoriesCount = 0
    let packingItemsCount = 0

    // Count nested items
    trips.forEach((trip) => {
      destinationsCount += trip.destinations.length
    })
    dayPlans.forEach((dayPlan) => {
      activitiesCount += dayPlan.activities.length
    })
    packingLists.forEach((list) => {
      packingCategoriesCount += list.categories.length
      list.categories.forEach((category) => {
        packingItemsCount += category.items.length
      })
    })

    if (merge) {
      // Merge mode: Add new data while keeping existing
      // Get existing IDs to avoid duplicates
      const existingTripIds = new Set(tripStore.trips.map((t) => t.id))
      const existingDayPlanIds = new Set(itineraryStore.dayPlans.map((d) => d.id))
      const existingAccommodationIds = new Set(accommodationStore.accommodations.map((a) => a.id))
      const existingExpenseIds = new Set(budgetStore.expenses.map((e) => e.id))
      const existingPackingListIds = new Set(packingStore.packingLists.map((p) => p.id))
      const existingTransportIds = new Set(transportStore.transports.map((t) => t.id))
      const existingTaskIds = new Set(tasksStore.tasks.map((t) => t.id))
      const existingDocumentIds = new Set(documentsStore.documents.map((d) => d.id))

      // Filter out duplicates and add new items
      const newTrips = trips.filter((t) => !existingTripIds.has(t.id))
      const newDayPlans = dayPlans.filter((d) => !existingDayPlanIds.has(d.id))
      const newAccommodations = accommodations.filter((a) => !existingAccommodationIds.has(a.id))
      const newExpenses = expenses.filter((e) => !existingExpenseIds.has(e.id))
      const newPackingLists = packingLists.filter((p) => !existingPackingListIds.has(p.id))
      const newTransports = transports.filter((t) => !existingTransportIds.has(t.id))
      const newTasks = tasks.filter((t) => !existingTaskIds.has(t.id))
      const newDocuments = documents.filter((d) => !existingDocumentIds.has(d.id))

      // Update stores with merged data
      useTripStore.setState({
        trips: [...tripStore.trips, ...newTrips],
      })
      useItineraryStore.setState({
        dayPlans: [...itineraryStore.dayPlans, ...newDayPlans],
      })
      useAccommodationStore.setState({
        accommodations: [...accommodationStore.accommodations, ...newAccommodations],
      })
      useBudgetStore.setState({
        expenses: [...budgetStore.expenses, ...newExpenses],
      })
      usePackingStore.setState({
        packingLists: [...packingStore.packingLists, ...newPackingLists],
      })
      useTransportStore.setState({
        transports: [...transportStore.transports, ...newTransports],
      })
      useTasksStore.setState({
        tasks: [...tasksStore.tasks, ...newTasks],
      })
      useDocumentsStore.setState({
        documents: [...documentsStore.documents, ...newDocuments],
      })

      // Update counts to reflect what was actually imported
      const importedTripsCount = newTrips.length
      const importedDayPlansCount = newDayPlans.length
      const importedAccommodationsCount = newAccommodations.length
      const importedExpensesCount = newExpenses.length
      const importedPackingListsCount = newPackingLists.length
      const importedTransportsCount = newTransports.length
      const importedTasksCount = newTasks.length
      const importedDocumentsCount = newDocuments.length

      let importedDestinationsCount = 0
      let importedActivitiesCount = 0
      let importedPackingCategoriesCount = 0
      let importedPackingItemsCount = 0

      newTrips.forEach((trip) => {
        importedDestinationsCount += trip.destinations.length
      })
      newDayPlans.forEach((dayPlan) => {
        importedActivitiesCount += dayPlan.activities.length
      })
      newPackingLists.forEach((list) => {
        importedPackingCategoriesCount += list.categories.length
        list.categories.forEach((category) => {
          importedPackingItemsCount += category.items.length
        })
      })

      return {
        success: true,
        importedCounts: {
          trips: importedTripsCount,
          destinations: importedDestinationsCount,
          dayPlans: importedDayPlansCount,
          activities: importedActivitiesCount,
          accommodations: importedAccommodationsCount,
          expenses: importedExpensesCount,
          packingLists: importedPackingListsCount,
          packingCategories: importedPackingCategoriesCount,
          packingItems: importedPackingItemsCount,
          transports: importedTransportsCount,
          tasks: importedTasksCount,
          documents: importedDocumentsCount,
        },
      }
    } else {
      // Replace mode: Clear all and import new
      useTripStore.setState({
        trips: trips,
        currentTripId: null,
      })
      useItineraryStore.setState({
        dayPlans: dayPlans,
      })
      useAccommodationStore.setState({
        accommodations: accommodations,
      })
      useBudgetStore.setState({
        expenses: expenses,
      })
      usePackingStore.setState({
        packingLists: packingLists,
      })
      useTransportStore.setState({
        transports: transports,
      })
      useTasksStore.setState({
        tasks: tasks,
      })
      useDocumentsStore.setState({
        documents: documents,
      })

      return {
        success: true,
        importedCounts: {
          trips: trips.length,
          destinations: destinationsCount,
          dayPlans: dayPlans.length,
          activities: activitiesCount,
          accommodations: accommodations.length,
          expenses: expenses.length,
          packingLists: packingLists.length,
          packingCategories: packingCategoriesCount,
          packingItems: packingItemsCount,
          transports: transports.length,
          tasks: tasks.length,
          documents: documents.length,
        },
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return {
      success: false,
      error: `Fehler beim Importieren der Daten: ${errorMessage}`,
    }
  }
}

// ============================================================================
// Combined Import with Validation
// ============================================================================

export function validateAndImport(
  data: unknown,
  options: ImportOptions
): ImportResult {
  const validation = validateImportData(data)

  if (!validation.success || !validation.data) {
    return {
      success: false,
      error: validation.error,
    }
  }

  return importData(validation.data, options)
}

// ============================================================================
// Export Schemas for external use
// ============================================================================

export {
  TripSchema,
  DestinationSchema,
  DayPlanSchema,
  ActivitySchema,
  AccommodationSchema,
  ExpenseSchema,
  PackingListSchema,
  PackingCategorySchema,
  PackingItemSchema,
  TransportSchema,
  TransportModeSchema,
  TransportLocationSchema,
  ExportDataSchema,
  TripStatusSchema,
  ActivityCategorySchema,
  AccommodationTypeSchema,
  ExpenseCategorySchema,
  PaymentMethodSchema,
}
