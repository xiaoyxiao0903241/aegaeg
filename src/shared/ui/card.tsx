import {
  createElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { type VariantProps } from 'tailwind-variants'
import { Text, type TextProps } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import { cardVariants } from '~/shared/ui/card-variants'

export type { CardSurface } from '~/shared/ui/card-variants'

type CardElement = 'article' | 'button' | 'div' | 'section' | 'details' | 'span'

export type CardProps = (HTMLAttributes<HTMLElement> | ButtonHTMLAttributes<HTMLButtonElement>) &
  VariantProps<typeof cardVariants> & {
    as?: CardElement
    children: ReactNode
  }

function CardRoot(
  { as = 'article', children, className, surface, ...props }: CardProps,
  ref: React.Ref<HTMLElement>,
) {
  return createElement(
    as,
    {
      ...props,
      ref,
      className: cn(cardVariants({ surface }), className),
    },
    children,
  )
}

export const Card = Object.assign(forwardRef(CardRoot), {
  Header,
  Title,
  Description,
  Content,
  Footer,
  Label,
  Value,
})

function Header({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function Title({ className, ...props }: Omit<TextProps, 'variant'>) {
  return <Text as="h3" variant="headline" className={cn('m-0', className)} {...props} />
}

function Description({ className, ...props }: Omit<TextProps, 'variant' | 'tone'>) {
  return (
    <Text
      variant="support"
      tone="muted-foreground"
      className={cn('m-0', className)}
      {...props}
    />
  )
}

function Content({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0', className)} {...props} />
}

function Footer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3', className)} {...props} />
}

/** Tier B · metric / meta 行标签（Figma 12px support） */
function Label({ className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="support" tone="foreground" className={className} {...props} />
  )
}

/** Tier B · 数值（默认 figure 字阶；比例字，无 tabular-nums） */
function Value({ className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text
      as="strong"
      variant="figure"
      className={cn('block leading-normal', className)}
      {...props}
    />
  )
}
