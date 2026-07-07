import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * tone = 语义色 | variant = 字阶/角色（含字号、行高、字距、默认字重）
 * 样式 SSOT：dev 分支有效 computed 样式 — 见 docs/typography-baseline.md
 */
const toneClass = {
  foreground: 'text-foreground',
  strong: 'text-ink-strong',
  faint: 'text-faint',
  subtle: 'text-ink-muted',
  accent: 'text-primary',
  inverse: 'text-white',
  'on-dark': 'text-on-dark',
  success: 'text-success',
  faq: 'text-faq-text',
  destructive: 'text-destructive',
} as const

export const textVariants = tv({
  base: 'font-normal tracking-normal',
  variants: {
    variant: {
      /* dev size 轴 */
      xs: 'text-xs leading-normal',
      sm: 'text-sm max-dapp:text-xs leading-normal',
      md: 'text-base max-dapp:text-sm leading-snug',
      lg: 'text-lg max-dapp:text-base font-semibold leading-snug tracking-tight',
      xl: 'text-xl max-dapp:text-lg font-semibold leading-snug tracking-tight',
      '2xl':
        'text-3xl max-dapp:text-2xl font-semibold leading-tight tracking-[-0.28px] max-dapp:tracking-tight',
      display: 'text-4xl max-dapp:text-2xl font-semibold leading-tight max-dapp:leading-snug',

      /* dapp-type-scale + 组件角色 */
      kicker:
        'text-[length:var(--dapp-type-kicker-size)] font-semibold uppercase leading-[1.2] tracking-[0.88px]',
      caption:
        'text-[length:var(--dapp-type-caption-size)] leading-[1.5] tracking-[-0.26px]',
      label: 'text-xs leading-normal tracking-[-0.24px]',
      hint: 'text-xs leading-normal tracking-[-0.24px]',
      body: 'text-sm max-dapp:text-xs leading-normal',
      'body-md': 'text-base max-dapp:text-sm leading-snug',
      lead: 'text-lg max-dapp:text-base font-semibold leading-snug tracking-tight',
      'content-heading':
        'text-lg max-dapp:text-base font-semibold leading-snug tracking-[-0.36px] max-dapp:tracking-[-0.68px]',
      title:
        'text-[length:var(--dapp-type-title-sm-size)] font-semibold leading-[1.3] tracking-[-0.63px]',
      'title-lg':
        'text-[length:var(--dapp-type-body-lg-size)] font-semibold leading-[1.3] tracking-[-0.34px] max-dapp:leading-[1.2]',
      'panel-title':
        'text-xl font-semibold leading-[1.3] tracking-[-0.84px] group-data-[tab=swap]/shell:dapp:tracking-[-0.42px] group-data-[tab=genesis]/shell:dapp:tracking-[-0.42px] group-data-[tab=rewards]/shell:dapp:tracking-[-0.42px] max-dapp:text-xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.88px]',
      'panel-subtitle': 'text-xs leading-[1.5] tracking-[-0.24px]',
      'rank-title':
        'text-[length:var(--dapp-type-body-lg-size)] font-semibold leading-[1.3] tracking-[-0.34px] !text-[length:var(--dapp-type-body-lg-size)] max-dapp:!text-[length:var(--dapp-type-body-lg-size)] max-dapp:leading-[1.2]',
      'value-sm': 'text-sm font-semibold leading-[1.2] tracking-[-0.28px]',
      'value-lg':
        'text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]',
      amount:
        'text-[length:var(--dapp-type-amount-size)] font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]',
      'referral-amount':
        'text-[length:var(--dapp-type-amount-size)] font-semibold leading-[1.3] tracking-[-0.54px] !text-[length:var(--dapp-type-amount-size)] max-dapp:!text-[length:var(--dapp-type-amount-size)] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]',
      'compact-title': 'text-[0.8125rem] font-semibold leading-[1.3] tracking-[-0.02em]',
      'compact-body': 'text-[0.8125rem] font-normal leading-[1.4] tracking-[-0.02em]',
      'program-title': 'text-[0.8125rem] font-semibold leading-[1.3] tracking-[0.08em]',
      'program-body': 'text-[0.8125rem] font-normal leading-[1.4] tracking-[-0.03em]',
      'meta-label': 'text-sm max-dapp:text-xs leading-normal max-dapp:text-faint',
      'metric-value':
        'text-lg max-dapp:text-base font-semibold leading-[1.2] tracking-[-0.36px]',
      'meta-value': 'text-sm max-dapp:text-xs font-semibold leading-normal',
      'table-cell':
        'text-sm max-dapp:text-xs leading-normal max-dapp:leading-normal font-normal tracking-normal',
      'season-title':
        'text-[length:var(--dapp-season-title-size)] font-semibold leading-[1.3] tracking-[-0.02em]',
      'season-meta':
        'text-[length:var(--dapp-season-meta-size)] leading-[1.5] tracking-[-0.02em]',
      'faq-question':
        'text-sm font-semibold leading-[1.3] tracking-[-0.3px] max-dapp:text-sm',
      'faq-answer':
        'text-sm font-normal leading-[1.5] tracking-[-0.28px] max-dapp:text-xs',

      /* Home */
      'section-eyebrow':
        'text-xs font-semibold leading-[1.25] tracking-[1.82px] max-dapp:text-xs max-dapp:tracking-[1.68px]',
      'section-display':
        'text-4xl font-semibold leading-tight max-dapp:text-2xl max-dapp:leading-snug max-dapp:text-balance',
      'section-subtitle': 'text-base font-normal leading-[1.5] max-dapp:text-sm',
      'hero-eyebrow': 'text-xs font-semibold leading-[1.2]',
      'hero-title':
        'text-6xl font-semibold leading-[1.08] tracking-normal max-dapp:text-4xl max-dapp:leading-[1.2]',
      'hero-body': 'text-lg font-normal leading-[1.5] max-dapp:text-sm',
      'metric-stat':
        'text-5xl font-semibold leading-none text-white max-dapp:text-3xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.9px]',
      'metric-label':
        'text-sm font-medium leading-[1.2] text-white max-dapp:text-xs max-dapp:font-normal max-dapp:leading-[1.5] max-dapp:text-on-dark',
      'feature-title': 'text-xl max-dapp:text-lg font-semibold leading-[1.2]',

      /* 迁移别名 — 与上列同义，逐步删除 call site */
      'title-xl':
        'text-xl font-semibold leading-[1.3] tracking-[-0.84px] max-dapp:text-xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.88px]',
      'home-eyebrow':
        'text-xs font-semibold leading-[1.25] tracking-[1.82px] max-dapp:text-xs max-dapp:tracking-[1.68px]',
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
    { variant: 'home-display', class: 'leading-tight max-dapp:leading-snug' },
    { variant: ['kicker', 'section-eyebrow', 'home-eyebrow'], tone: 'accent', class: 'text-primary' },
    { variant: ['section-eyebrow', 'home-eyebrow'], tone: 'foreground', class: 'text-primary' },
    { variant: 'panel-subtitle', class: '[&_strong]:font-bold [&_strong]:text-primary' },
    { variant: 'season-meta', tone: 'subtle', class: 'text-muted-foreground' },
  ],
  defaultVariants: {
    variant: 'body',
    tone: 'foreground',
    tabular: false,
  },
})

export type TextVariant = keyof typeof textVariants.variants.variant
export type TextTone = keyof typeof toneClass

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'strong' | 'a' | 'small' | 'em' | 'b' | 'div' | 'time'
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
          tone: tone ?? 'foreground',
          weight,
          tabular,
        }),
        className,
      ),
    },
    children,
  )
}
