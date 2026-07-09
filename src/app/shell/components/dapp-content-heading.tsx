import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { dappDetailTitleGapClass } from '~/app/dapp-detail-layout'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export function DappContentHeading({
  children,
  className,
  id,
  reveal = false,
  variant = 'section',
}: {
  children: ReactNode
  className?: string
  id?: string
  reveal?: boolean
  variant?: 'section'
}) {
  return (
    <Text
      as="h2"
      variant={variant}
      className={cn(
        'm-0 max-dapp:mt-0',
        // H5 uses --type-section-size (17px); do not lock to text-base (16px).
        'max-dapp:text-[length:var(--type-section-size)]',
        // Default = Genesis/Rewards/Community (Figma dl). Swap: keep section leading, tracking -0.04em only.
        'group-data-[tab=swap]/shell:tracking-[-0.04em] group-data-[tab=swap]/shell:max-dapp:tracking-[-0.04em]',
        'group-data-[tab=genesis]/shell:leading-snug group-data-[tab=rewards]/shell:leading-snug group-data-[tab=community]/shell:leading-snug',
        'group-data-[tab=genesis]/shell:tracking-[-0.36px] group-data-[tab=rewards]/shell:tracking-[-0.36px] group-data-[tab=community]/shell:tracking-[-0.36px]',
        'group-data-[tab=genesis]/shell:max-dapp:tracking-[-0.68px] group-data-[tab=rewards]/shell:max-dapp:tracking-[-0.68px] group-data-[tab=community]/shell:max-dapp:tracking-[-0.68px]',
        dappDetailTitleGapClass,
        reveal && revealClass(),
        className,
      )}
      data-reveal={reveal ? '' : undefined}
      id={id}
    >
      {children}
    </Text>
  )
}
