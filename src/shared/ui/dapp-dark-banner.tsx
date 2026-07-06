import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export const dappDarkBanner = tv({
  slots: {
    root: cn(revealClass(), 'relative overflow-hidden rounded-md bg-dark text-white shadow-card'),
    content: 'relative z-1 flex flex-col gap-2',
    kicker: 'text-coral-bright',
    title: 'text-white max-dapp:text-lg max-dapp:leading-[1.2] max-dapp:tracking-[-0.54px]',
    body: 'text-on-dark',
    decoration: 'pointer-events-none absolute select-none',
  },
})

export function DappDarkBannerKicker({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const styles = dappDarkBanner()
  return (
    <Text as="span" size="kicker" className={cn(styles.kicker(), className)}>
      {children}
    </Text>
  )
}

export function DappDarkBannerTitle({
  as = 'strong',
  children,
  className,
}: {
  as?: 'h3' | 'strong'
  children: ReactNode
  className?: string
}) {
  const styles = dappDarkBanner()
  return (
    <Text as={as} size="titleSm" weight="semibold" className={cn(styles.title(), className)}>
      {children}
    </Text>
  )
}

export function DappDarkBannerBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const styles = dappDarkBanner()
  return (
    <Text as="p" size="caption" className={cn('m-0', styles.body(), className)}>
      {children}
    </Text>
  )
}
