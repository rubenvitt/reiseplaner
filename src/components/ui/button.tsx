'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Ripple-Effekt Komponente
interface RippleProps {
  x: number
  y: number
  size: number
}

const Ripple = React.memo(({ x, y, size }: RippleProps) => (
  <motion.span
    className="absolute rounded-full bg-foreground/20 pointer-events-none"
    style={{
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
    }}
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 2, opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  />
))
Ripple.displayName = 'Ripple'

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animated?: boolean
  enableRipple?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animated = true,
      enableRipple = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number; size: number }>
    >([])
    const rippleIdRef = React.useRef(0)

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (enableRipple && animated) {
          const button = event.currentTarget
          const rect = button.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const size = Math.max(rect.width, rect.height)

          const newRipple = {
            id: rippleIdRef.current++,
            x,
            y,
            size,
          }

          setRipples((prev) => [...prev, newRipple])

          // Ripple nach Animation entfernen
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
          }, 500)
        }

        onClick?.(event)
      },
      [enableRipple, animated, onClick]
    )

    // Animation-Varianten
    const motionProps = animated
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 17,
          },
        }
      : {}

    return (
      <motion.button
        className={cn(
          buttonVariants({ variant, size, className }),
          enableRipple && 'relative overflow-hidden'
        )}
        ref={ref}
        onClick={handleClick}
        {...motionProps}
        {...props}
      >
        {children}
        {enableRipple &&
          ripples.map((ripple) => (
            <Ripple
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              size={ripple.size}
            />
          ))}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
