/**
 * Tour-Schritte Konfiguration
 *
 * Definiert alle Schritte für das Onboarding-Tour-System.
 * Jeder Schritt referenziert ein Element via data-tour Attribut.
 */

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TourStep {
  id: string
  target: string // CSS Selector, z.B. '[data-tour="create-trip"]'
  title: string
  content: string
  placement: TourPlacement
}

/**
 * Tour-Schritte für das Dashboard
 */
export const dashboardTour: TourStep[] = [
  {
    id: 'create-trip',
    target: '[data-tour="create-trip"]',
    title: 'Neue Reise erstellen',
    content: 'Klicke hier um deine erste Reise zu planen. Du kannst Reiseziel, Datum und Budget festlegen.',
    placement: 'bottom',
  },
  {
    id: 'trip-card',
    target: '[data-tour="trip-card"]',
    title: 'Deine Reisen',
    content: 'Hier siehst du alle deine geplanten Reisen auf einen Blick. Klicke auf eine Reise, um Details zu sehen.',
    placement: 'bottom',
  },
  {
    id: 'sidebar-nav',
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigation',
    content: 'Nutze die Seitenleiste, um schnell zwischen verschiedenen Bereichen deiner Reiseplanung zu wechseln.',
    placement: 'right',
  },
  {
    id: 'theme-toggle',
    target: '[data-tour="theme-toggle"]',
    title: 'Design anpassen',
    content: 'Wechsle zwischen hellem und dunklem Modus - ganz nach deinem Geschmack.',
    placement: 'bottom',
  },
  {
    id: 'export-import',
    target: '[data-tour="export-import"]',
    title: 'Daten sichern',
    content: 'Exportiere deine Reisedaten oder importiere bestehende Planungen, um nichts zu verlieren.',
    placement: 'left',
  },
]

/**
 * Tour-Schritte für die Reise-Detail-Seite
 */
export const tripDetailTour: TourStep[] = [
  {
    id: 'trip-overview',
    target: '[data-tour="trip-overview"]',
    title: 'Reiseübersicht',
    content: 'Hier findest du alle wichtigen Informationen zu deiner Reise zusammengefasst.',
    placement: 'bottom',
  },
  {
    id: 'itinerary',
    target: '[data-tour="itinerary"]',
    title: 'Tagesplanung',
    content: 'Plane deine Aktivitäten Tag für Tag und behalte den Überblick über dein Programm.',
    placement: 'bottom',
  },
  {
    id: 'budget',
    target: '[data-tour="budget"]',
    title: 'Budget-Tracker',
    content: 'Behalte deine Ausgaben im Blick und plane dein Reisebudget effektiv.',
    placement: 'bottom',
  },
  {
    id: 'packing',
    target: '[data-tour="packing"]',
    title: 'Packliste',
    content: 'Erstelle deine persönliche Packliste und vergiss nie wieder etwas Wichtiges.',
    placement: 'bottom',
  },
]

/**
 * Alle verfügbaren Touren
 */
export const tours = {
  dashboard: dashboardTour,
  tripDetail: tripDetailTour,
} as const

export type TourId = keyof typeof tours
