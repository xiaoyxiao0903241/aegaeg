import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Button } from '~/shared/components/button'
import { cn } from '~/shared/lib/utils'

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /**
   * card = 白卡 CTA · external = 操作区大按钮 · inverse = 深色促销 ·
   * modal = 弹窗底部 · hero = 社区 / 页头横幅 CTA
   */
  density?: 'card' | 'external' | 'inverse' | 'modal' | 'hero'
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

/**
 * 主 CTA 按钮。
 *
 * 按 density 档位固定高度，可带加载态；输入框旁小操作、顶栏连接请用对应轻量组件。
 *
 * @param density 高度档位，见 {@link CtaButtonProps}
 * @param loading 为 true 时禁用并显示加载圈
 */
export function CtaButton({
  children,
  className,
  density = 'card',
  disabled,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: CtaButtonProps) {
  const size = density === 'hero' || density === 'external' ? 'lg' : 'sm'

  return (
    <Button
      aria-busy={loading || undefined}
      className={cn(
        'gap-2',
        density === 'card' && 'min-h-10.5',
        density === 'inverse' && 'min-h-9.5 text-xs',
        density === 'modal' && 'min-h-11.5',
        density === 'external' && 'min-h-0 py-4 text-base leading-5',
        density === 'hero' && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      size={size}
      type={type}
      variant={variant}
      {...props}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-4 shrink-0 animate-spin" strokeWidth={2} />
      ) : null}
      {children}
    </Button>
  )
}
