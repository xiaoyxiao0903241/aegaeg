import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/**
 * tone = 语义色 | variant = 字阶/角色（字号/行高/字重由 --type-* token 驱动）。
 * 高频语义；页面可用 className 微调。11 variant × 7 tone；无 weight prop。
 *
 * 若 className 含字号 utility（`text-4xl` / `text-[…]`），视为显示阶覆盖：
 * 剥掉 size / leading / tracking type token（twMerge 对 arbitrary tracking 冲突不全），
 * 保留 weight——call site 通常只覆盖字号/行高。
 */
const toneClass = {
  foreground: 'text-foreground',
  'muted-foreground': 'text-muted-foreground',
  primary: 'text-primary',
  /** Dark-surface coral accent (not primary). */
  'primary-bright': 'text-primary-bright',
  success: 'text-success',
  inverse: 'text-inverse',
  /** Secondary copy on dark / inverse surfaces. */
  'inverse-muted': 'text-inverse-muted',
} as const

export const textVariants = tv({
  variants: {
    variant: {
      caption:
        'text-(length:--type-caption-size) leading-(--type-caption-leading) font-(--type-caption-weight) tracking-(--type-caption-tracking)',
      eyebrow:
        'text-(length:--type-eyebrow-size) leading-(--type-eyebrow-leading) font-(--type-eyebrow-weight) tracking-(--type-eyebrow-tracking) uppercase',
      support:
        'text-(length:--type-support-size) leading-(--type-support-leading) font-(--type-support-weight) tracking-(--type-support-tracking)',
      copy: 'text-(length:--type-copy-size) leading-(--type-copy-leading) font-(--type-copy-weight) tracking-(--type-copy-tracking)',
      detail:
        'text-(length:--type-detail-size) leading-(--type-detail-leading) font-(--type-detail-weight) tracking-(--type-detail-tracking)',
      question:
        'text-(length:--type-question-size) leading-(--type-question-leading) font-(--type-question-weight) tracking-(--type-question-tracking)',
      headline:
        'text-(length:--type-headline-size) leading-(--type-headline-leading) font-(--type-headline-weight) tracking-(--type-headline-tracking)',
      brand:
        'text-(length:--type-brand-size) leading-(--type-brand-leading) font-(--type-brand-weight) tracking-(--type-brand-tracking)',
      section:
        'text-(length:--type-section-size) leading-(--type-section-leading) font-(--type-section-weight) tracking-(--type-section-tracking)',
      panel:
        'text-(length:--type-panel-size) leading-(--type-panel-leading) font-(--type-panel-weight) tracking-(--type-panel-tracking)',
      figure:
        'text-(length:--type-figure-size) leading-(--type-figure-leading) font-(--type-figure-weight) tracking-(--type-figure-tracking)',
    },
    tone: toneClass,
  },
  compoundVariants: [
    { variant: 'eyebrow', tone: 'primary', class: 'text-primary' },
    { variant: 'panel', class: '[&_strong]:font-bold [&_strong]:text-primary' },
  ],
  defaultVariants: {
    variant: 'copy',
    tone: 'foreground',
  },
})

export type TextVariant = keyof typeof textVariants.variants.variant
export type TextTone = keyof typeof toneClass

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?:
    | 'p'
    | 'span'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'strong'
    | 'a'
    | 'small'
    | 'em'
    | 'b'
    | 'div'
    | 'time'
    | 'label'
  children: ReactNode
  href?: string
  htmlFor?: string
  rel?: string
  target?: string
} & VariantProps<typeof textVariants>

/**
 * Unprefixed Tailwind font-size utility (`text-*`, `!text-*`, or TW4 `text-*!`).
 * Responsive prefixes (`max-dapp:text-lg`) must not strip base `--type-*` size —
 * otherwise desktop keeps the override flag while the media query is inactive,
 * collapsing panel/section figures to inherited 16px.
 */
/** Named sizes + size-like arbitrary / CSS-var shorthand. Not `text-[#hex]` colors. */
const FONT_SIZE_UTILITY_RE =
  /(?:^|[\s])!?text-(?:xs|sm|base|lg|xl|[2-9]xl|(?:\[(?:length:|\d|\.\d)[^\]]*\]|\((?:length:)?--[^)]+\)))(?:\/[^\s]*)?!?(?=[\s]|$)/

/** Type tokens to drop on display-size override (keep font-weight). */
const VARIANT_TYPE_TOKEN_RE =
  /^(?:text-(?:\[length:|\(length:--)|leading-(?:\[var\(--type-|\(--type-)|tracking-(?:\[var\(--type-|\(--type-))/

function classNameOverridesFontSize(className: string | undefined): boolean {
  if (!className) return false
  return FONT_SIZE_UTILITY_RE.test(` ${className} `)
}

function stripVariantTypeTokens(variantClassName: string): string {
  return variantClassName
    .split(/\s+/)
    .filter((token) => token.length > 0 && !VARIANT_TYPE_TOKEN_RE.test(token))
    .join(' ')
}

export function Text({ as = 'span', children, className, variant, tone, ...props }: TextProps) {
  const variantClassName = textVariants({
    variant: variant ?? 'copy',
    tone: tone ?? 'foreground',
  })
  const resolvedVariant = classNameOverridesFontSize(className)
    ? stripVariantTypeTokens(variantClassName)
    : variantClassName

  return createElement(
    as,
    {
      ...props,
      className: cn(resolvedVariant, className),
    },
    children,
  )
}
