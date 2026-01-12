'use client'

import * as React from 'react'
import { WelcomeScreen } from './WelcomeScreen'
import { TourOverlay } from './TourOverlay'
import { useUIStore } from '@/stores/uiStore'
import { tours, type TourStep, type TourId } from '@/config/tourSteps'

// Context Typen
interface OnboardingContextValue {
  // Tour State
  isWelcomeOpen: boolean
  isTourActive: boolean
  currentTourId: TourId | null
  currentStepIndex: number

  // Tour Actions
  startTour: (tourId?: TourId) => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  goToStep: (index: number) => void

  // Welcome Screen Actions
  openWelcome: () => void
  closeWelcome: () => void
}

const OnboardingContext = React.createContext<OnboardingContextValue | undefined>(
  undefined
)

/**
 * Hook zum Zugriff auf den Onboarding-Context
 */
export function useOnboarding() {
  const context = React.useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: React.ReactNode
  /** Standard-Tour die beim ersten Besuch gestartet wird */
  defaultTour?: TourId
}

/**
 * OnboardingProvider - Verwaltet das gesamte Onboarding-System
 *
 * Bietet:
 * - Welcome Screen beim ersten Besuch
 * - Interaktive Tour durch die App
 * - Speichert den Besuchsstatus im localStorage
 */
export function OnboardingProvider({
  children,
  defaultTour = 'dashboard',
}: OnboardingProviderProps) {
  // UI Store für Persistenz
  const isFirstVisit = useUIStore((state) => state.isFirstVisit)
  const setFirstVisit = useUIStore((state) => state.setFirstVisit)

  // Lokaler State
  const [isWelcomeOpen, setIsWelcomeOpen] = React.useState(false)
  const [isTourActive, setIsTourActive] = React.useState(false)
  const [currentTourId, setCurrentTourId] = React.useState<TourId | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)

  // Aktuelle Tour-Schritte
  const currentTourSteps: TourStep[] = currentTourId
    ? tours[currentTourId]
    : []

  // Zeige Welcome Screen beim ersten Besuch
  React.useEffect(() => {
    if (isFirstVisit) {
      // Kurze Verzögerung damit die App erst rendert
      const timer = setTimeout(() => {
        setIsWelcomeOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isFirstVisit])

  // Tour starten
  const startTour = React.useCallback((tourId: TourId = defaultTour) => {
    setIsWelcomeOpen(false)
    setCurrentTourId(tourId)
    setCurrentStepIndex(0)
    setIsTourActive(true)
  }, [defaultTour])

  // Nächster Schritt
  const nextStep = React.useCallback(() => {
    if (currentStepIndex < currentTourSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      // Tour beendet
      setIsTourActive(false)
      setCurrentTourId(null)
      setCurrentStepIndex(0)
      setFirstVisit(false)
    }
  }, [currentStepIndex, currentTourSteps.length, setFirstVisit])

  // Vorheriger Schritt
  const prevStep = React.useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }, [currentStepIndex])

  // Tour überspringen
  const skipTour = React.useCallback(() => {
    setIsTourActive(false)
    setIsWelcomeOpen(false)
    setCurrentTourId(null)
    setCurrentStepIndex(0)
    setFirstVisit(false)
  }, [setFirstVisit])

  // Zu bestimmtem Schritt springen
  const goToStep = React.useCallback((index: number) => {
    if (index >= 0 && index < currentTourSteps.length) {
      setCurrentStepIndex(index)
    }
  }, [currentTourSteps.length])

  // Welcome Screen öffnen/schließen
  const openWelcome = React.useCallback(() => {
    setIsWelcomeOpen(true)
  }, [])

  const closeWelcome = React.useCallback(() => {
    setIsWelcomeOpen(false)
    setFirstVisit(false)
  }, [setFirstVisit])

  // Context Wert
  const contextValue = React.useMemo<OnboardingContextValue>(
    () => ({
      isWelcomeOpen,
      isTourActive,
      currentTourId,
      currentStepIndex,
      startTour,
      nextStep,
      prevStep,
      skipTour,
      goToStep,
      openWelcome,
      closeWelcome,
    }),
    [
      isWelcomeOpen,
      isTourActive,
      currentTourId,
      currentStepIndex,
      startTour,
      nextStep,
      prevStep,
      skipTour,
      goToStep,
      openWelcome,
      closeWelcome,
    ]
  )

  // Keyboard Navigation
  React.useEffect(() => {
    if (!isTourActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevStep()
          break
        case 'Escape':
          e.preventDefault()
          skipTour()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTourActive, nextStep, prevStep, skipTour])

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}

      {/* Welcome Screen */}
      <WelcomeScreen
        isOpen={isWelcomeOpen}
        onStartTour={() => startTour(defaultTour)}
        onSkip={closeWelcome}
      />

      {/* Tour Overlay */}
      <TourOverlay
        isActive={isTourActive}
        steps={currentTourSteps}
        currentStepIndex={currentStepIndex}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
      />
    </OnboardingContext.Provider>
  )
}
