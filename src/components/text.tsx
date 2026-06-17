import { createElement, type HTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/lib/utils'

/** size = 字号/字距 | weight = 字重 | tone = 语义色 */
export const textVariants = tv({
  base: 'font-normal tracking-[0] text-foreground',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-[13px]',
      md: 'text-[15px]',
      lg: 'text-lg tracking-[-0.36px]',
      xl: 'text-[21px] tracking-[-0.84px] max-[820px]:text-[22px] max-[820px]:tracking-[-0.88px]',
      '2xl': 'text-[30px] tracking-[-1.2px]',
      display: 'text-[40px] max-[820px]:text-[26px]',
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
    { size: ['xs', 'sm'], class: 'leading-[1.5]' },
    { size: ['md', 'lg', 'xl'], class: 'leading-[1.3]' },
    { size: '2xl', class: 'leading-[1.2]' },
    { size: 'display', class: 'leading-[1.15] max-[820px]:leading-[1.2]' },
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
