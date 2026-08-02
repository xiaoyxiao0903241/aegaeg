import { tv, type VariantProps } from 'tailwind-variants'

/** DApp icon sizes — `tokens/theme.css` (`--app-icon-*`). */
export const dappIcon = tv({
  base: 'block shrink-0',
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
    /**
     * `circle`：稿面 token 圆标（AmountBox / 指标行）。
     * 用 `object-cover` 填满圆盘；方图靠 `rounded-full` 裁成圆（Figma inputBox `4448:615`）。
     */
    shape: {
      plain: 'object-contain',
      circle: 'rounded-full object-cover',
    },
  },
  defaultVariants: {
    size: 'base',
    shape: 'plain',
  },
})

export type DappIconSize = NonNullable<VariantProps<typeof dappIcon>['size']>
export type DappIconShape = NonNullable<VariantProps<typeof dappIcon>['shape']>
