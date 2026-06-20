import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/lib/utils'

/** size = 字号/字距 | weight = 字重 | tone = 语义色 — PC/H5 响应式字号 SSOT */
export const textVariants = tv({
  base: 'font-normal tracking-normal text-foreground',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm max-dapp:text-xs',
      md: 'text-base max-dapp:text-sm',
      lg: 'text-lg max-dapp:text-base tracking-tight',
      xl: 'text-xl max-dapp:text-lg tracking-tight',
      '2xl': 'text-3xl max-dapp:text-2xl tracking-tight',
      display: 'text-4xl max-dapp:text-2xl',
    },
    weight: {
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tone: {
      muted: 'text-faint',
      body: 'text-ink-strong',
      subtle: 'text-ink-muted',
      coral: 'text-primary',
      success: 'text-success',
      onDark: 'text-on-dark',
      faq: 'text-faq-text',
    },
  },
  compoundVariants: [
    { size: ['xs', 'sm'], class: 'leading-normal' },
    { size: ['md', 'lg', 'xl'], class: 'leading-snug' },
    { size: '2xl', class: 'leading-tight' },
    { size: 'display', class: 'leading-tight max-dapp:leading-snug' },
  ],
  defaultVariants: {
    size: 'sm',
  },
})

export type TextTone = keyof NonNullable<VariantProps<typeof textVariants>['tone']>

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'strong' | 'a' | 'small' | 'em' | 'b'
  children: ReactNode
  href?: string
  rel?: string
  target?: string
} & VariantProps<typeof textVariants>

export function Text({
  as = 'span',
  children,
  className,
  size,
  weight,
  tone,
  ...props
}: TextProps) {
  return createElement(
    as,
    {
      ...props,
      className: cn(textVariants({ size, weight, tone }), className),
    },
    children,
  )
}
