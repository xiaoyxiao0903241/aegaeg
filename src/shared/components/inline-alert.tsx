import type { ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Text, type TextProps } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * Inline destructive alert chrome (border / wash / pad / color).
 * Typography stays Text `copy`; spacing (mt/mx/mb) stays at call site.
 */
export const inlineAlert = tv({
  base: 'rounded-xl border border-destructive/30 bg-destructive/10 text-destructive',
  variants: {
    density: {
      /** Widget stack (trade / flash). */
      compact: 'px-3.5 py-2.5',
      /** Shell-level banner. */
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
