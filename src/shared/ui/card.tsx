import {
  createElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Text, type TextProps } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Primitive：surface / fill / radius · 组合式子组件（shadcn 风格）内化 Text 字阶。
 * SSOT：docs/foundation/api.md §1 · 页面只组合 Card.* + 布局 className。
 */
export const cardVariants = tv({
  variants: {
    context: {
      dapp: 'bg-card',
      home: '',
    },
    surface: {
      outlined: 'rounded-md border border-border px-4 py-3.5',
      elevated: 'rounded-md px-4 py-3.5 shadow-card',
      soft: 'overflow-hidden rounded-2xl shadow-subtle',
      faq: 'overflow-hidden rounded-2xl bg-white shadow-faq',
    },
    fill: {
      surface: 'bg-card shadow-card',
      transparent: '',
      token: 'text-white shadow-token',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-md',
      lg: 'rounded-md',
      xl: 'rounded-lg',
      full: 'rounded-full',
    },
    tone: {
      dark: 'border-0 bg-dark text-white',
    },
    hover: {
      shadow:
        'transition-shadow duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:shadow-[0_0.875rem_2.125rem_oklch(22%_0.04_265_/_10%)] focus-within:shadow-[0_0.875rem_2.125rem_oklch(22%_0.04_265_/_10%)]',
    },
  },
  defaultVariants: {
    context: 'dapp',
    surface: 'outlined',
  },
})

type CardElement = 'article' | 'button' | 'div' | 'section' | 'details' | 'span'

export type CardProps = (HTMLAttributes<HTMLElement> | ButtonHTMLAttributes<HTMLButtonElement>) &
  VariantProps<typeof cardVariants> & {
    as?: CardElement
    children: ReactNode
  }

function CardRoot(
  {
    as = 'article',
    children,
    className,
    context = 'dapp',
    surface,
    fill,
    radius,
    tone,
    hover,
    ...props
  }: CardProps,
  ref: React.Ref<HTMLElement>,
) {
  return createElement(
    as,
    {
      ...props,
      ref,
      className: cn(
        cardVariants({
          context,
          surface: context === 'dapp' ? (surface ?? 'outlined') : undefined,
          fill: context === 'home' ? (fill ?? 'surface') : undefined,
          radius: context === 'home' ? (radius ?? 'md') : undefined,
          tone,
          hover,
        }),
        className,
      ),
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
      variant="copy"
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

/** Tier B · metric / meta 行标签 */
function Label({ className, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="copy" tone="foreground" className={className} {...props} />
}

/** Tier B · 数值（默认 amount 字阶；stat 大卡可 className 微调） */
function Value({ className, tabular = true, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text
      as="strong"
      variant="figure"
      tabular={tabular}
      className={cn('block', className)}
      {...props}
    />
  )
}

export { Header as CardHeader }
export { Title as CardTitle }
export { Description as CardDescription }
export { Content as CardContent }
export { Footer as CardFooter }
export { Label as CardLabel }
export { Value as CardValue }
