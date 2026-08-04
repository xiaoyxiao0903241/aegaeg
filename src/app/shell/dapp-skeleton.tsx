import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/** Mobile community stat shell — shared by live cards (≥2 call sites → shell). */
export const communityStatCardMobileShell = tv({
  base: cn(
    'max-dapp:items-start max-dapp:rounded-md max-dapp:border-0',
    'max-dapp:p-(--dapp-community-stat-padding) max-dapp:text-left max-dapp:shadow-card',
  ),
})

const dappSkeleton = tv({
  base: ['block rounded-md', 'motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'],
  variants: {
    tone: {
      surface: 'bg-skeleton',
      dark: 'bg-skeleton-on-dark',
    },
  },
  defaultVariants: {
    tone: 'surface',
  },
})

export function DappSkeleton({
  className,
  tone = 'surface',
}: {
  className?: string
  tone?: 'dark' | 'surface'
}) {
  return <span aria-hidden="true" className={dappSkeleton({ tone, class: className })} />
}
