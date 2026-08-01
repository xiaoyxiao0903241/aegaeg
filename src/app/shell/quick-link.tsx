import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { Text } from '~/shared/ui/text'

export type QuickLinkProps = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
}

export function QuickLink({ href, icon, iconTone = 'coral', label }: QuickLinkProps) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  const isBrandIcon = iconTone === 'plain'
  const insetIconClass = dappIcon({ size: iconTone === 'dark' ? 'md' : 'lg' })

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
