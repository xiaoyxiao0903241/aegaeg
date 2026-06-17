import type { ReactNode } from 'react'
import { dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

export type QuickLinkItem = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
  size?: number
}

export function QuickLinks({ className, items }: { className?: string; items: QuickLinkItem[] }) {
  return (
    <div className={cn(dappLayout.quickLinks, 'max-[820px]:mt-0', className)}>
      {items.map((item) => (
        <a className={dappLayout.quickLink} href={item.href} key={item.href}>
          <span
            className={cn(
              dappLayout.quickLinkIcon,
              item.iconTone === 'dark' && dappLayout.quickLinkIconDark,
              item.iconTone === 'plain' && dappLayout.quickLinkIconPlain,
            )}
          >
            <img
              src={item.icon}
              alt=""
              width={item.size ?? 18}
              height={item.size ?? 18}
              loading="lazy"
            />
          </span>
          {item.label}
        </a>
      ))}
    </div>
  )
}
