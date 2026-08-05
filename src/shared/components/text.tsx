import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/**
 * 文本 — `tone` 选语义色，`variant` 选字阶，`as` 指定渲染标签。
 * 高频语义；页面可用 className 微调。无 weight prop。
 *
 * className 含字号工具类时视为显示阶覆盖：覆盖类型令牌的字号 / 行高 / 字距，保留字重。
 */
const toneClass = {
  foreground: 'text-foreground',
  'muted-foreground': 'text-muted-foreground',
  primary: 'text-primary',
  /** 深色面上的珊瑚强调色（非 primary） */
  'primary-bright': 'text-primary-bright',
  success: 'text-success',
  inverse: 'text-inverse',
  /** 深色 / 反色面上的次级文字 */
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
      /** 结果区大额数字 */
      stat: 'text-(length:--type-stat-size) leading-(--type-stat-leading) font-(--type-stat-weight) tracking-(--type-stat-tracking)',
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
 * 匹配无前缀的字号工具类（text-* 系列，含响应式变体）。
 * 响应式前缀（如 `max-dapp:text-lg`）会连同基础字号一起剥掉，
 * 否则媒体查询未生效时，面板 / 区块的数字字阶会塌回继承的 16px。
 *
 * 耦合点（B3）：声明式 `size` prop 会更好，但本仓 call site 大量靠 className
 * 覆盖字号；半迁移成本高，暂保持正则剥壳，勿在未全仓迁移时改公共 API。
 */
/** 命名尺寸 + 类尺寸的任意值 / CSS 变量简写；不含 `text-[#hex]` 颜色 */
const FONT_SIZE_UTILITY_RE =
  /(?:^|[\s])!?text-(?:xs|sm|base|lg|xl|[2-9]xl|(?:\[(?:length:|\d|\.\d)[^\]]*\]|\((?:length:)?--[^)]+\)))(?:\/[^\s]*)?!?(?=[\s]|$)/

/** 显示阶覆盖时剥掉的字号 / 行高 / 字距令牌（保留字重） */
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

/**
 * 文本
 *
 * 用 `variant` 选字阶、`tone` 选语义色，`as` 指定渲染标签；
 * 样式由 `textVariants` 定义（见上）。
 */
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
