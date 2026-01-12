'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Plane, MapPin, Calendar, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WelcomeScreenProps {
  isOpen: boolean
  onStartTour: () => void
  onSkip: () => void
}

// Animation Variants
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
}

const iconContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
}

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

const floatingAnimationDelayed1 = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay: 0.5,
  },
}

const floatingAnimationDelayed2 = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay: 1,
  },
}

export function WelcomeScreen({
  isOpen,
  onStartTour,
  onSkip,
}: WelcomeScreenProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className={cn(
              'relative z-10 w-full max-w-lg',
              'rounded-2xl border border-border',
              'bg-gradient-to-br from-background via-background to-primary/5',
              'p-8 shadow-2xl'
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Dekorative Elemente */}
            <div className="absolute -top-3 -right-3 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-secondary/20 blur-xl" />

            {/* Icon Container */}
            <motion.div
              className="relative mb-6 flex justify-center gap-4"
              variants={iconContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={iconVariants}
                animate={floatingAnimation}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Plane className="h-7 w-7" />
              </motion.div>
              <motion.div
                variants={iconVariants}
                animate={floatingAnimationDelayed1}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground"
              >
                <MapPin className="h-7 w-7" />
              </motion.div>
              <motion.div
                variants={iconVariants}
                animate={floatingAnimationDelayed2}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent-foreground"
              >
                <Compass className="h-7 w-7" />
              </motion.div>
            </motion.div>

            {/* Titel */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Willkommen
                </span>
              </div>
              <h1
                id="welcome-title"
                className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Willkommen beim Reiseplaner!
              </h1>
              <p className="text-muted-foreground">
                Plane deine Reisen einfach und effizient. Erstelle Routen,
                verwalte dein Budget und behalte alle wichtigen Details im
                Blick.
              </p>
            </motion.div>

            {/* Features */}
            <motion.ul
              className="my-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {[
                { icon: Calendar, text: 'Reisen und Aktivitäten planen' },
                { icon: MapPin, text: 'Unterkünfte und Transport verwalten' },
                { icon: Compass, text: 'Packlisten und Budget im Blick' },
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </span>
                  {feature.text}
                </motion.li>
              ))}
            </motion.ul>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-3 sm:flex-row sm:justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={onSkip}
                className="order-2 sm:order-1"
              >
                Später
              </Button>
              <Button
                onClick={onStartTour}
                className="order-1 sm:order-2"
                enableRipple
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Tour starten
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
