import type { ReactNode } from 'react'

import { iconVariants } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type QuickLinkProps = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
}

/**
 * 快捷入口链接卡：图标 + 文字，外部链接新窗口打开。
 *
 * @param href 跳转地址
 * @param icon 图标资源路径
 * @param iconTone coral=主色圆底 · dark=深色圆底 · plain=品牌图标原样
 * @param label 文字内容
 */
export function QuickLink({ href, icon, iconTone = 'coral', label }: QuickLinkProps) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  const isBrandIcon = iconTone === 'plain'
  const insetIconClass = iconVariants({ size: iconTone === 'dark' ? 'md' : 'lg' })

  return (
    <a
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-subtle bg-card px-3.5 py-3',
        'duration-dapp-fast transition-[border-color,transform] ease-out',
        'hover:translate-x-0.5 hover:border-coral-hover-border',
      )}
      href={href}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <span
        className={cn(
          'grid size-7.5 flex-none place-items-center rounded-full',
          iconTone === 'coral' && 'bg-primary text-white',
          iconTone === 'dark' && 'bg-foreground',
          isBrandIcon && 'bg-transparent',
        )}
      >
        <img
          alt=""
          className={cn(
            'block shrink-0 object-contain',
            isBrandIcon ? 'size-full' : insetIconClass,
          )}
          loading="lazy"
          src={icon}
        />
      </span>
      <Text as="span" variant="headline" className="text-sm/normal">
        {label}
      </Text>
    </a>
  )
}
