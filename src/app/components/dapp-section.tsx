import type { ReactNode } from 'react'
import { dappHeading } from '../../lib/dapp-styles'
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
      className={cn(
        'mt-8 max-[820px]:mt-6 group-data-[tab=rewards]/shell:max-[820px]:mt-[22px]',
        revealClass(),
        className,
      )}
      data-reveal
    >
      <h3 className={dappHeading.sectionTitle}>{title}</h3>
      {children}
    </section>
  )
}
