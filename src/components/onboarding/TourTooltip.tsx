'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TourPlacement } from '@/config/tourSteps'

interface TourTooltipProps {
  title: string
  content: string
  placement: TourPlacement
  currentStep: number
  totalSteps: number
  position: { top: number; left: number }
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  canGoBack: boolean
  isLastStep: boolean
}

// Berechne die Position des Pfeils basierend auf der Platzierung
const arrowStyles: Record<TourPlacement, string> = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-border',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-border',
  left: 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-border',
  right: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-border',
}

const arrowBackgroundStyles: Record<TourPlacement, string> = {
  top: 'bottom-[-7px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-background',
  bottom: 'top-[-7px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-background',
  left: 'right-[-7px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-background',
  right: 'left-[-7px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-background',
}

const tooltipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export function TourTooltip({
  title,
  content,
  placement,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrev,
  onSkip,
  canGoBack,
  isLastStep,
}: TourTooltipProps) {
  return (
    <motion.div
      role="tooltip"
      className={cn(
        'fixed z-[110] w-80',
        'rounded-lg border border-border bg-background',
        'shadow-xl'
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
      variants={tooltipVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Pfeil - Border */}
      <div
        className={cn(
          'absolute h-0 w-0 border-8',
          arrowStyles[placement]
        )}
      />
      {/* Pfeil - Background */}
      <div
        className={cn(
          'absolute h-0 w-0 border-8',
          arrowBackgroundStyles[placement]
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Schritt {currentStep} von {totalSteps}
          </p>
          <h3 className="mt-1 font-semibold">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onSkip}
          aria-label="Tour ueberspringen"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-muted-foreground"
        >
          Ueberspringen
        </Button>
        <div className="flex gap-2">
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Zurueck
            </Button>
          )}
          <Button size="sm" onClick={onNext}>
            {isLastStep ? (
              'Fertig'
            ) : (
              <>
                Weiter
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
