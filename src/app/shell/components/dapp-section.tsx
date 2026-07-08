import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { dappDetailSectionGapClass, dappDetailTitleGapClass } from '~/app/dapp-detail-layout'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

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
    <section
      className={cn(dappDetailSectionGapClass, revealClass(), className)}
      data-reveal
    >
      <Text
        as="h3"
        variant="section"
        className={cn('m-0', dappDetailTitleGapClass, titleClassName)}
      >
        {title}
      </Text>
      {children}
    </section>
  )
}
