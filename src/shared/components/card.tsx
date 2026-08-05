import {
  type ButtonHTMLAttributes,
  createElement,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Text, type TextProps } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 卡片 — 四种表面
 *
 * outlined 为默认描边卡片，布局微调用 className。
 */
export const cardVariants = tv({
  base: 'bg-card text-card-foreground',
  variants: {
    surface: {
      outlined: 'rounded-md border border-border p-4',
      /** 右栏指标瓦；禁止调用方再改内边距 / 圆角 / 阴影 */
      elevated: 'rounded-md bg-card p-4 shadow-card',
      /** FAQ / 手风琴外壳；内边距由内容自己负责 */
      soft: 'overflow-hidden rounded-2xl bg-card shadow-faq',
      inverse: 'rounded-md bg-dark p-4 text-white shadow-subtle',
    },
  },
  defaultVariants: {
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

/**
 * 卡片容器
 *
 * 与 Header / Title / Description / Content / Footer / Label / Value 子件组合使用。
 */
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
    <Text variant="support" tone="muted-foreground" className={cn('m-0', className)} {...props} />
  )
}

function Content({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0', className)} {...props} />
}

function Footer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3', className)} {...props} />
}

/** 指标 / 元数据行标签 */
function Label({ className, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="support" tone="foreground" className={className} {...props} />
}

/** 指标数值 */
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
