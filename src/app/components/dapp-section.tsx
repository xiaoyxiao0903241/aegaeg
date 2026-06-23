import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { dappDetailSectionGapClass, dappDetailTitleGapClass } from '~/app/dapp-detail-layout'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function DappSection({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title: ReactNode
}) {
  return (
    <section
      className={cn(dappDetailSectionGapClass, revealClass(), className)}
      data-reveal
    >
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className={cn(
          'tracking-[-0.36px] max-dapp:text-base max-dapp:tracking-[-0.68px]',
          dappDetailTitleGapClass,
        )}
      >
        {title}
      </Text>
      {children}
    </section>
  )
}
