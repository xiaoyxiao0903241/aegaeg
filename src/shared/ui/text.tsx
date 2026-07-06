import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/** size = 字号/字距 | weight = 字重 | tone = 语义色 — PC/H5 响应式字号 SSOT；H5 全局各档 +1px 见 `mobile-type-scale.css` */
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
      kicker:
        'text-[length:var(--dapp-type-kicker-size)] font-semibold uppercase leading-[1.2] tracking-[0.88px]',
      caption:
        'text-[length:var(--dapp-type-caption-size)] leading-[1.5] tracking-[-0.26px]',
      titleSm:
        'text-[length:var(--dapp-type-title-sm-size)] font-semibold leading-[1.3] tracking-[-0.63px]',
      bodyLg:
        'text-[length:var(--dapp-type-body-lg-size)] leading-[1.3] tracking-[-0.34px]',
      amount:
        'text-[length:var(--dapp-type-amount-size)] font-semibold leading-normal tracking-[-0.44px]',
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
    { size: 'amount', class: 'leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]' },
    { size: 'bodyLg', weight: 'semibold', class: 'max-dapp:leading-[1.2]' },
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
