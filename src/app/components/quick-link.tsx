import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { cn } from '~/lib/utils'

export type QuickLinkProps = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
}

export function QuickLink({ href, icon, iconTone = 'coral', label }: QuickLinkProps) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  const isBrandIcon = iconTone === 'plain'
  const insetIconClass = iconTone === 'dark' ? dappIconClass.md : dappIconClass.lg

  return (
    <a
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-subtle bg-card px-3.5 py-3',
        'transition-[border-color,transform] duration-[180ms] ease-out',
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
          className={cn('block shrink-0 object-contain', isBrandIcon ? 'size-full' : insetIconClass)}
          loading="lazy"
          src={icon}
        />
      </span>
      <Text as="span" size="sm" weight="semibold" className="tracking-[-0.28px]">
        {label}
      </Text>
    </a>
  )
}
