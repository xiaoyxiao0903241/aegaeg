import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * tone = 语义色 | variant = 字阶/角色（字号/行高/字重由 --type-* token 驱动）
 * SSOT：docs/foundation/api.md §2 · 流程：docs/foundation/runbook.md
 *
 * Primitive 只覆盖高频语义；页面/section 用 className 微调（design-system-audit §2）。
 * 10 variant × 5 tone；无 weight prop；无 alias。
 */
const toneClass = {
  foreground: 'text-foreground',
  'muted-foreground': 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  inverse: 'text-inverse',
} as const

export const textVariants = tv({
  variants: {
    variant: {
      caption: 'text-[length:var(--type-caption-size)] font-medium leading-snug',
      eyebrow:
        'text-[length:var(--type-eyebrow-size)] font-semibold uppercase leading-snug tracking-wide',
      copy: 'text-[length:var(--type-copy-size)] font-normal leading-normal',
      detail: 'text-[length:var(--type-detail-size)] font-normal leading-normal',
      question: 'text-[length:var(--type-question-size)] font-semibold leading-snug',
      headline: 'text-[length:var(--type-headline-size)] font-semibold leading-snug',
      brand: 'text-[length:var(--type-brand-size)] font-semibold leading-snug',
      section: 'text-[length:var(--type-section-size)] font-semibold leading-tight',
      panel: 'text-[length:var(--type-panel-size)] font-semibold leading-snug tracking-tight',
      figure: 'text-[length:var(--type-figure-size)] font-semibold leading-snug',
    },
    tone: toneClass,
    tabular: {
      true: 'tabular-nums',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'eyebrow', tone: 'primary', class: 'text-primary' },
    { variant: 'panel', class: '[&_strong]:font-bold [&_strong]:text-primary' },
  ],
  defaultVariants: {
    variant: 'copy',
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
          variant: variant ?? 'copy',
          tone: tone ?? 'foreground',
          tabular,
        }),
        className,
      ),
    },
    children,
  )
}
