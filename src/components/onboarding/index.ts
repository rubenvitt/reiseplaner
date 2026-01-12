/**
 * Onboarding System Exports
 *
 * Dieses Modul stellt das komplette Onboarding-System bereit:
 * - OnboardingProvider: Context Provider für die gesamte App
 * - useOnboarding: Hook zum Zugriff auf Onboarding-Funktionen
 * - WelcomeScreen: Modal beim ersten Besuch
 * - TourOverlay: Spotlight-Overlay für die Tour
 * - TourTooltip: Tooltip-Komponente für Tour-Schritte
 */

export { OnboardingProvider, useOnboarding } from './OnboardingProvider'
export { WelcomeScreen } from './WelcomeScreen'
export { TourOverlay } from './TourOverlay'
export { TourTooltip } from './TourTooltip'
