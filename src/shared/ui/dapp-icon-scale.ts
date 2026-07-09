import { tv, type VariantProps } from 'tailwind-variants'

/** DApp icon sizes — `tokens/theme.css` (`--app-icon-*`). */
export const dappIcon = tv({
  base: 'shrink-0',
  variants: {
    size: {
      xs: 'size-(--app-icon-xs)',
      sm: 'size-(--app-icon-sm)',
      md: 'size-(--app-icon-md)',
      base: 'size-(--app-icon-base)',
      action: 'size-(--app-icon-action)',
      lg: 'size-(--app-icon-lg)',
      xl: 'size-(--app-icon-xl)',
      rail: 'size-(--app-icon-rail)',
      token: 'size-(--app-icon-token)',
      brand: 'size-(--app-icon-brand)',
    },
  },
  defaultVariants: {
    size: 'base',
  },
})

export type DappIconSize = NonNullable<VariantProps<typeof dappIcon>['size']>
