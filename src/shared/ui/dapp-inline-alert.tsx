import type { ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Text, type TextProps } from '~/shared/ui/text'

/**
 * Inline destructive alert chrome (border / wash / pad / color).
 * Typography stays Text `copy`; spacing (mt/mx/mb) stays at call site.
 */
export const dappInlineAlert = tv({
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

export type DappInlineAlertDensity = NonNullable<VariantProps<typeof dappInlineAlert>['density']>

export type DappInlineAlertProps = Omit<TextProps, 'tone' | 'variant'> & {
  children: ReactNode
  density?: DappInlineAlertDensity
}

export function DappInlineAlert({
  as = 'p',
  children,
  className,
  density = 'compact',
  ...props
}: DappInlineAlertProps) {
  return (
    <Text
      as={as}
      variant="copy"
      tone="foreground"
      className={cn(dappInlineAlert({ density }), className)}
      {...props}
    >
      {children}
    </Text>
  )
}
