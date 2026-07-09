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
        className={cn(
          'm-0',
          // 4175 Genesis/Rewards/Community section h3: leading-snug (24.75) + tracking -0.36px.
          // Swap keeps global --type-section-leading 1.3 — do not widen the token.
          'group-data-[tab=genesis]/shell:leading-snug group-data-[tab=genesis]/shell:tracking-[-0.36px]',
          'group-data-[tab=rewards]/shell:leading-snug group-data-[tab=rewards]/shell:tracking-[-0.36px]',
          'group-data-[tab=community]/shell:leading-snug group-data-[tab=community]/shell:tracking-[-0.36px]',
          dappDetailTitleGapClass,
          titleClassName,
        )}
      >
        {title}
      </Text>
      {children}
    </section>
  )
}
