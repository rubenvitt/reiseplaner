/**
 * Framer Motion Animation Presets
 *
 * Diese Datei enthält wiederverwendbare Animation-Presets
 * für konsistente Animationen in der gesamten Anwendung.
 */

import type { Variants, Transition } from 'framer-motion'

// ============================================
// Transitions
// ============================================

/**
 * Federartige Transition mit natürlichem Bounce-Effekt
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
}

/**
 * Sanfte Transition mit Ease-Out-Kurve
 */
export const smoothTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
}

// ============================================
// Fade Animations
// ============================================

/**
 * Fade von unten nach oben
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothTransition
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
}

/**
 * Fade von oben nach unten
 */
export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothTransition
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 }
  }
}

/**
 * Einfaches Fade ohne Bewegung
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// ============================================
// Scale Animations
// ============================================

/**
 * Scale von klein zu groß mit Fade
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springTransition
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 }
  }
}

// ============================================
// Slide Animations
// ============================================

/**
 * Slide von links mit Fade
 */
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothTransition
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

/**
 * Slide von rechts mit Fade
 */
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothTransition
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
}

// ============================================
// Stagger Animations
// ============================================

/**
 * Container für gestaffelte Animationen
 * Verwendung: Als Parent-Element für staggerItem Kinder
 *
 * @example
 * <motion.ul variants={staggerContainer} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItem}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
}

/**
 * Item für gestaffelte Listen
 * Verwendet fadeInUp Animation mit verzögerter Ausführung
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 15
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 }
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Erstellt eine verzögerte Version eines Animation Presets
 */
export const withDelay = (variants: Variants, delay: number): Variants => ({
  ...variants,
  animate: {
    ...variants.animate,
    transition: {
      ...(typeof variants.animate === 'object' && 'transition' in variants.animate
        ? variants.animate.transition
        : {}),
      delay,
    }
  }
})

/**
 * Erstellt eine Version mit angepasster Dauer
 */
export const withDuration = (variants: Variants, duration: number): Variants => ({
  ...variants,
  animate: {
    ...variants.animate,
    transition: {
      ...(typeof variants.animate === 'object' && 'transition' in variants.animate
        ? variants.animate.transition
        : {}),
      duration,
    }
  }
})
