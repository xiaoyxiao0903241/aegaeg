import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

const toneClass = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  accent: 'text-primary',
  success: 'text-success',
  inverse: 'text-white',
} as const

/** variant = 字阶/角色 | tone = 语义色 — PC/H5 响应式见 `mobile-type-scale.css` + `dapp-scale.css` */
export const textVariants = tv({
  base: 'font-normal tracking-normal',
  variants: {
    variant: {
      kicker:
        'text-[length:var(--dapp-type-kicker-size)] font-semibold uppercase leading-[1.2] tracking-[0.88px]',
      caption:
        'text-[length:var(--dapp-type-caption-size)] leading-[1.5] tracking-[-0.26px]',
      label: 'text-xs font-normal leading-normal tracking-[-0.24px]',
      hint: 'text-xs font-normal leading-normal tracking-[-0.24px]',
      body: 'text-sm max-dapp:text-xs font-normal leading-normal',
      'body-md': 'text-base max-dapp:text-sm font-normal leading-snug',
      lead: 'text-lg max-dapp:text-base font-semibold leading-snug tracking-[-0.36px]',
      title:
        'text-[length:var(--dapp-type-title-sm-size)] font-semibold leading-[1.3] tracking-[-0.63px]',
      'title-lg':
        'text-[length:var(--dapp-type-body-lg-size)] font-semibold leading-[1.3] tracking-[-0.34px] max-dapp:leading-[1.2]',
      'rank-title':
        'text-[length:var(--dapp-type-body-lg-size)] font-semibold leading-[1.3] tracking-[-0.34px] !text-[length:var(--dapp-type-body-lg-size)] max-dapp:!text-[length:var(--dapp-type-body-lg-size)] max-dapp:leading-[1.2]',
      'title-xl':
        'text-xl font-semibold leading-[1.3] tracking-[-0.84px] max-dapp:text-xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.88px]',
      'value-sm': 'text-sm font-semibold leading-[1.2] tracking-[-0.28px]',
      'value-lg':
        'text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]',
      amount:
        'text-[length:var(--dapp-type-amount-size)] font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]',
      'compact-title': 'text-[0.8125rem] font-semibold leading-[1.3] tracking-[-0.02em]',
      'compact-body': 'text-[0.8125rem] font-normal leading-[1.4] tracking-[-0.02em]',
      'faq-question':
        'text-sm font-semibold leading-[1.3] tracking-[-0.3px] max-dapp:text-sm',
      'faq-answer':
        'text-sm font-normal leading-[1.5] tracking-[-0.28px] max-dapp:text-xs',
      'home-eyebrow':
        'text-xs font-semibold leading-[1.25] tracking-[1.82px] text-primary max-dapp:text-xs max-dapp:tracking-[1.68px]',
      'home-display':
        'text-4xl font-semibold leading-tight max-dapp:text-2xl max-dapp:leading-[1.2] max-dapp:text-balance',
      'home-lead': 'text-lg font-normal leading-[1.5] max-dapp:text-sm',
    },
    tone: toneClass,
    weight: {
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tabular: {
      true: 'tabular-nums',
      false: '',
    },
  },
  compoundVariants: [
    { variant: ['label', 'hint', 'body'], class: 'leading-normal' },
    { variant: ['body-md', 'lead', 'title-xl'], class: 'leading-snug' },
    { variant: 'home-display', class: 'leading-tight max-dapp:leading-snug' },
    { variant: 'kicker', tone: 'accent', class: 'text-primary' },
    { variant: 'title-lg', tone: 'primary', class: 'text-foreground' },
  ],
  defaultVariants: {
    variant: 'body',
    tone: 'primary',
    tabular: false,
  },
})

export type TextVariant = keyof typeof textVariants.variants.variant
export type TextTone = keyof typeof toneClass

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'strong' | 'a' | 'small' | 'em' | 'b' | 'div'
  children: ReactNode
  href?: string
  rel?: string
  target?: string
  tabular?: boolean
} & VariantProps<typeof textVariants>

export function Text({
  as = 'span',
  children,
  className,
  variant,
  weight,
  tone,
  tabular,
  ...props
}: TextProps) {
  return createElement(
    as,
    {
      ...props,
      className: cn(
        textVariants({
          variant: variant ?? 'body',
          tone: tone ?? 'primary',
          weight,
          tabular,
        }),
        className,
      ),
    },
    children,
  )
}
