import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/lib/utils'

/** DApp：context=dapp + surface | Home：context=home + fill + radius */
export const cardVariants = tv({
  variants: {
    context: {
      dapp: 'rounded-md bg-card px-4 py-3.5',
      home: '',
    },
    surface: {
      outlined: 'border border-border',
      elevated: 'shadow-card',
    },
    fill: {
      surface: 'bg-card shadow-card',
      transparent: '',
      token: 'text-white shadow-token',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-md',
      lg: 'rounded-md',
      xl: 'rounded-lg',
      full: 'rounded-full',
    },
    tone: {
      dark: 'border-0 bg-dark text-white',
    },
    hover: {
      shadow:
        'transition-shadow duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:shadow-[0_0.875rem_2.125rem_oklch(22%_0.04_265_/_10%)] focus-within:shadow-[0_0.875rem_2.125rem_oklch(22%_0.04_265_/_10%)]',
    },
  },
  defaultVariants: {
    context: 'dapp',
    surface: 'outlined',
  },
})

export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    as?: 'article' | 'div' | 'section' | 'details' | 'span'
    children: ReactNode
  }

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as = 'article',
    children,
    className,
    context = 'dapp',
    surface,
    fill,
    radius,
    tone,
    hover,
    ...props
  },
  ref,
) {
  return createElement(
    as,
    {
      ...props,
      ref,
      className: cn(
        cardVariants({
          context,
          surface: context === 'dapp' ? (surface ?? 'outlined') : undefined,
          fill: context === 'home' ? (fill ?? 'surface') : undefined,
          radius: context === 'home' ? (radius ?? 'md') : undefined,
          tone,
          hover,
        }),
        className,
      ),
    },
    children,
  )
})
