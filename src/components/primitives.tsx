import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { homeCardClass, homeTextClass } from '~/lib/home-styles'

type HomeCardRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none'
type HomeCardTone = 'surface' | 'dark' | 'transparent' | 'token'
type HomeCardBorder = 'none' | 'all' | 'desktopLeft' | 'desktopTop'
type HomeTextVariant = Parameters<typeof homeTextClass>[0]
type HomeTextTone = NonNullable<Parameters<typeof homeTextClass>[1]>['tone']

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'details' | 'span'
  children: ReactNode
  open?: boolean
  spotlight?: boolean
  radius?: HomeCardRadius
  tone?: HomeCardTone
  border?: HomeCardBorder
  interactive?: boolean
  hover?: 'none' | 'shadow'
}

export function Card({
  as = 'article',
  children,
  className,
  radius,
  tone,
  border,
  interactive,
  hover,
  spotlight,
  ...props
}: CardProps) {
  return createElement(
    as,
    {
      ...props,
      className: homeCardClass({ radius, tone, border, interactive, hover, className }),
      ...(spotlight ? { 'data-spotlight-card': true } : {}),
    },
    children,
  )
}

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'h2' | 'h3' | 'strong' | 'a'
  children: ReactNode
  href?: string
  rel?: string
  target?: string
  variant?: HomeTextVariant
  tone?: HomeTextTone
}

export function Text({
  as = 'span',
  children,
  className,
  variant,
  tone,
  ...props
}: TextProps) {
  return createElement(
    as,
    {
      ...props,
      className: variant
        ? homeTextClass(variant, { tone, className })
        : className,
    },
    children,
  )
}
