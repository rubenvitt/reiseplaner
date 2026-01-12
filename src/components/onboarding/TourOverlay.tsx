'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TourTooltip } from './TourTooltip'
import type { TourStep } from '@/config/tourSteps'

interface TourOverlayProps {
  isActive: boolean
  steps: TourStep[]
  currentStepIndex: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

const PADDING = 8 // Padding um das hervorgehobene Element
const TOOLTIP_OFFSET = 16 // Abstand zwischen Element und Tooltip

export function TourOverlay({
  isActive,
  steps,
  currentStepIndex,
  onNext,
  onPrev,
  onSkip,
}: TourOverlayProps) {
  const [mounted, setMounted] = React.useState(false)
  const [targetRect, setTargetRect] = React.useState<TargetRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 })

  const currentStep = steps[currentStepIndex]

  // Initialisiere mounted State
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Finde und tracke das Ziel-Element
  React.useEffect(() => {
    if (!isActive || !currentStep) return

    const updateTargetPosition = () => {
      const target = document.querySelector(currentStep.target)
      if (!target) {
        setTargetRect(null)
        return
      }

      const rect = target.getBoundingClientRect()
      setTargetRect({
        top: rect.top - PADDING,
        left: rect.left - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
      })

      // Scrolle Element in den sichtbaren Bereich wenn noetig
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth

      if (!isInViewport) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
    }

    // Initial Update
    updateTargetPosition()

    // Update bei Resize oder Scroll
    window.addEventListener('resize', updateTargetPosition)
    window.addEventListener('scroll', updateTargetPosition, true)

    return () => {
      window.removeEventListener('resize', updateTargetPosition)
      window.removeEventListener('scroll', updateTargetPosition, true)
    }
  }, [isActive, currentStep])

  // Berechne Tooltip-Position basierend auf Element und Placement
  React.useEffect(() => {
    if (!targetRect || !currentStep) return

    const TOOLTIP_WIDTH = 320 // Breite des Tooltips (w-80)
    const TOOLTIP_HEIGHT = 220 // Geschaetzte Hoehe des Tooltips

    let top = 0
    let left = 0

    switch (currentStep.placement) {
      case 'top':
        top = targetRect.top - TOOLTIP_HEIGHT - TOOLTIP_OFFSET
        left = targetRect.left + targetRect.width / 2 - TOOLTIP_WIDTH / 2
        break
      case 'bottom':
        top = targetRect.top + targetRect.height + TOOLTIP_OFFSET
        left = targetRect.left + targetRect.width / 2 - TOOLTIP_WIDTH / 2
        break
      case 'left':
        top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT / 2
        left = targetRect.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET
        break
      case 'right':
        top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT / 2
        left = targetRect.left + targetRect.width + TOOLTIP_OFFSET
        break
    }

    // Halte Tooltip im sichtbaren Bereich
    const margin = 16
    left = Math.max(margin, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - margin))
    top = Math.max(margin, Math.min(top, window.innerHeight - TOOLTIP_HEIGHT - margin))

    setTooltipPosition({ top, left })
  }, [targetRect, currentStep])

  // Verwalte Body-Overflow
  React.useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isActive])

  if (!mounted) return null

  // Erstelle den SVG-Pfad fuer das Spotlight (Loch im Overlay)
  const createSpotlightPath = () => {
    if (!targetRect) return ''

    const { top, left, width, height } = targetRect
    const radius = 8 // Border-Radius fuer das Spotlight

    // Aeusserer Pfad (voller Bildschirm)
    const outer = `M 0 0 L ${window.innerWidth} 0 L ${window.innerWidth} ${window.innerHeight} L 0 ${window.innerHeight} Z`

    // Innerer Pfad (abgerundetes Rechteck - gegen den Uhrzeigersinn fuer das Loch)
    const inner = `
      M ${left + radius} ${top}
      L ${left + width - radius} ${top}
      Q ${left + width} ${top} ${left + width} ${top + radius}
      L ${left + width} ${top + height - radius}
      Q ${left + width} ${top + height} ${left + width - radius} ${top + height}
      L ${left + radius} ${top + height}
      Q ${left} ${top + height} ${left} ${top + height - radius}
      L ${left} ${top + radius}
      Q ${left} ${top} ${left + radius} ${top}
      Z
    `

    return `${outer} ${inner}`
  }

  return createPortal(
    <AnimatePresence>
      {isActive && currentStep && (
        <div className="fixed inset-0 z-[105]">
          {/* SVG Overlay mit Spotlight */}
          <motion.svg
            className="fixed inset-0 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.path
              d={createSpotlightPath()}
              fill="rgba(0, 0, 0, 0.75)"
              fillRule="evenodd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            {/* Leuchtender Rand um das Spotlight */}
            {targetRect && (
              <motion.rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx={8}
                ry={8}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            )}
          </motion.svg>

          {/* Click-Handler fuer das Overlay (zum Schliessen) */}
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={(e) => {
              // Nur schliessen wenn direkt auf das Overlay geklickt wird
              if (e.target === e.currentTarget) {
                onSkip()
              }
            }}
          />

          {/* Tooltip */}
          {targetRect && (
            <TourTooltip
              title={currentStep.title}
              content={currentStep.content}
              placement={currentStep.placement}
              currentStep={currentStepIndex + 1}
              totalSteps={steps.length}
              position={tooltipPosition}
              onNext={onNext}
              onPrev={onPrev}
              onSkip={onSkip}
              canGoBack={currentStepIndex > 0}
              isLastStep={currentStepIndex === steps.length - 1}
            />
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
