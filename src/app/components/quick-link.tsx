import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { cn } from '~/lib/utils'

export type QuickLinkProps = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
  size?: number
}

export function QuickLink({ href, icon, iconTone = 'coral', label, size = 18 }: QuickLinkProps) {
  return (
    <a
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-subtle bg-card px-3.5 py-3',
        'transition-[border-color,transform] duration-[180ms] ease-out',
        'hover:translate-x-0.5 hover:border-coral-hover-border',
      )}
      href={href}
    >
      <span
        className={cn(
          'grid aspect-square w-7.5 flex-none place-items-center rounded-full bg-primary text-white',
          iconTone === 'dark' && 'bg-foreground',
          iconTone === 'plain' && 'bg-transparent',
        )}
      >
        <img alt="" height={size} loading="lazy" src={icon} width={size} />
      </span>
      <Text as="span" size="sm" weight="semibold" className="tracking-[-0.28px]">
        {label}
      </Text>
    </a>
  )
}
