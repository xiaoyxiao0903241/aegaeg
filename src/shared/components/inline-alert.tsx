import type { ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Text, type TextProps } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 行内错误提示外观
 *
 * 文案排版交给 Text；外间距由调用方控制。
 */
export const inlineAlert = tv({
  base: 'rounded-xl border border-destructive/30 bg-destructive/10 text-destructive',
  variants: {
    density: {
      /** 组件内紧凑提示（交易 / 闪电兑换） */
      compact: 'px-3.5 py-2.5',
      /** 页面级横幅 */
      comfortable: 'px-4 py-3',
    },
  },
  defaultVariants: {
    density: 'compact',
  },
})

export type InlineAlertDensity = NonNullable<VariantProps<typeof inlineAlert>['density']>

export type InlineAlertProps = Omit<TextProps, 'tone' | 'variant'> & {
  children: ReactNode
  density?: InlineAlertDensity
}

/**
 * 行内错误提示
 *
 * 红色描边底色，用于表单错误等场景。
 *
 * @param density compact（组件内）/ comfortable（页面级）
 */
export function InlineAlert({
  as = 'p',
  children,
  className,
  density = 'compact',
  ...props
}: InlineAlertProps) {
  return (
    <Text
      as={as}
      variant="copy"
      tone="foreground"
      className={cn(inlineAlert({ density }), className)}
      {...props}
    >
      {children}
    </Text>
  )
}
