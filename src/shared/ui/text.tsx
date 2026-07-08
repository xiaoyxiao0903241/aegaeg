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
      caption:
        'text-[length:var(--type-caption-size)] font-[var(--type-caption-weight)] leading-[var(--type-caption-leading)] tracking-[var(--type-caption-tracking)]',
      eyebrow:
        'text-[length:var(--type-eyebrow-size)] font-[var(--type-eyebrow-weight)] leading-[var(--type-eyebrow-leading)] tracking-[var(--type-eyebrow-tracking)] uppercase',
      copy: 'text-[length:var(--type-copy-size)] font-[var(--type-copy-weight)] leading-[var(--type-copy-leading)] tracking-[var(--type-copy-tracking)]',
      detail:
        'text-[length:var(--type-detail-size)] font-[var(--type-detail-weight)] leading-[var(--type-detail-leading)] tracking-[var(--type-detail-tracking)]',
      question:
        'text-[length:var(--type-question-size)] font-[var(--type-question-weight)] leading-[var(--type-question-leading)] tracking-[var(--type-question-tracking)]',
      headline:
        'text-[length:var(--type-headline-size)] font-[var(--type-headline-weight)] leading-[var(--type-headline-leading)] tracking-[var(--type-headline-tracking)]',
      brand:
        'text-[length:var(--type-brand-size)] font-[var(--type-brand-weight)] leading-[var(--type-brand-leading)] tracking-[var(--type-brand-tracking)]',
      section:
        'text-[length:var(--type-section-size)] font-[var(--type-section-weight)] leading-[var(--type-section-leading)] tracking-[var(--type-section-tracking)]',
      panel:
        'text-[length:var(--type-panel-size)] font-[var(--type-panel-weight)] leading-[var(--type-panel-leading)] tracking-[var(--type-panel-tracking)]',
      figure:
        'text-[length:var(--type-figure-size)] font-[var(--type-figure-weight)] leading-[var(--type-figure-leading)] tracking-[var(--type-figure-tracking)]',
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
