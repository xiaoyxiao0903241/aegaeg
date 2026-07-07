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
  variant = 'content-heading',
}: {
  children: ReactNode
  className?: string
  id?: string
  reveal?: boolean
  variant?: 'content-heading' | 'detail-section-title'
}) {
  return (
    <Text
      as="h2"
      variant={variant}
      className={cn(
        'm-0 max-dapp:mt-0',
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
