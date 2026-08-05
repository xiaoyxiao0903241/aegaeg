import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Button } from '~/shared/components/button'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 主操作按钮。
 *
 * 高度按 density 档位适配，供各页面主 CTA 使用；
 * 输入框旁的小操作、顶部栏连接按钮不适用本密度表，请用对应轻量组件。
 */
type DappActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
 * 主操作按钮，按 density 档位固定高度。
 *
 * @param density 高度档位，见 {@link DappActionButtonProps}
 * @param loading 为 true 时禁用按钮并显示加载圈
 */
export function DappActionButton({
  children,
  className,
  density = 'card',
  disabled,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: DappActionButtonProps) {
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
