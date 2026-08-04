import type { ImgHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/** Icon sizes / shape — `tokens/theme.css` (`--app-icon-*`). */
export const iconVariants = tv({
  base: 'block shrink-0',
  variants: {
    size: {
      xs: 'size-(--app-icon-xs)',
      sm: 'size-(--app-icon-sm)',
      md: 'size-(--app-icon-md)',
      base: 'size-(--app-icon-base)',
      action: 'size-(--app-icon-action)',
      lg: 'size-(--app-icon-lg)',
      caption: 'size-(--app-icon-caption)',
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

export type IconSize = NonNullable<VariantProps<typeof iconVariants>['size']>
export type IconShape = NonNullable<VariantProps<typeof iconVariants>['shape']>

type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  shape?: IconShape
  size?: IconSize
  src: string
}

/** 文件图（SVG/PNG URL）— chrome 线框直接用 lucide-react，勿混进本组件。 */
export function Icon({
  alt = '',
  className,
  shape = 'plain',
  size = 'base',
  src,
  ...props
}: IconProps) {
  return (
    <img
      alt={alt}
      className={iconVariants({ size, shape, class: className })}
      src={src}
      {...props}
    />
  )
}
