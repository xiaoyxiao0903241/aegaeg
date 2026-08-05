import type { ImgHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/** 图标尺寸 / 形状变体 */
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
     * `circle`：圆形代币图标（数量输入 / 指标行）。
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

/**
 * 图片图标
 *
 * 通过 URL 加载 SVG / PNG 图标；线框图标直接用 lucide-react，不混入本组件。
 *
 * @param src 图标文件地址
 * @param size 图标尺寸
 * @param shape plain（原样）/ circle（圆形裁剪）
 */
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
