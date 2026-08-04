import type { ReactNode } from 'react'

import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * Detail section block — title uses Text `section` (same as DappContentHeading).
 * Block gap via DappDetailBlock; title→content `pb-4`.
 */
export function DappSection({
  children,
  className,
  title,
  titleClassName,
}: {
  children: ReactNode
  className?: string
  title: ReactNode
  titleClassName?: string
}) {
  return (
    <DappDetailBlock className={cn(revealClass(), className)} data-reveal>
      <Text as="h3" variant="section" className={cn('m-0 pb-4', titleClassName)}>
        {title}
      </Text>
      {children}
    </DappDetailBlock>
  )
}
