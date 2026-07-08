import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'

/**
 * tone = 语义色 | variant = 字阶/角色（字号/行高/字重由 --type-* token 驱动）
 * SSOT：docs/foundation/api.md §2 · 流程：docs/foundation/runbook.md
 *
 * Primitive 只覆盖高频语义；页面/section 用 className 微调（design-system-audit §2）。
 * 10 variant × 6 tone；无 weight prop；无 alias。
 *
 * 若 className 含字号 utility（`text-4xl` / `text-[…]`），视为「显示阶覆盖」：
 * 剥掉 size / leading / tracking type token（twMerge 对 arbitrary tracking 冲突不全），
 * **保留** weight——call site 通常只覆盖字号/行高，字重仍走 variant token。
 */
const toneClass = {
  foreground: 'text-foreground',
  'muted-foreground': 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  inverse: 'text-inverse',
  /** Secondary copy on dark / inverse surfaces — Figma/dev `#b8c0ce` (not white@opacity). */
  'inverse-muted': 'text-inverse-muted',
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

/**
 * Unprefixed Tailwind font-size utility (or `!text-*`).
 * Responsive prefixes (`max-dapp:text-lg`) must NOT strip base `--type-*` size —
 * otherwise desktop keeps the override flag while the media query is inactive,
 * collapsing panel/section figures to inherited 16px (genesis global value REGRESSION).
 */
const FONT_SIZE_UTILITY_RE =
  /(?:^|[\s])!?text-(?:xs|sm|base|lg|xl|[2-9]xl|(?:\[[^\]]+\]))(?:\/[^\s]*)?(?=[\s]|$)/

/** Type tokens to drop on display-size override (keep font-weight). */
const VARIANT_TYPE_TOKEN_RE =
  /^(?:text-\[length:|leading-\[var\(--type-|tracking-\[var\(--type-)/

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

export function Text({
  as = 'span',
  children,
  className,
  variant,
  tone,
  tabular,
  ...props
}: TextProps) {
  const variantClassName = textVariants({
    variant: variant ?? 'copy',
    tone: tone ?? 'foreground',
    tabular,
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
