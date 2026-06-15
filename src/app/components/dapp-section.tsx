import type { ReactNode } from 'react'
import { dappTextClass } from '../../components/primitive-styles'
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
      <h3
        className={cn(
          dappTextClass('titleMd', { tone: 'ink' }),
          'group-data-[tab=rewards]/shell:tracking-[-0.72px] group-data-[tab=community]/shell:tracking-[-0.72px]',
          'group-data-[tab=rewards]/shell:max-[820px]:text-[17px]',
        )}
      >
        {title}
      </h3>
      {children}
    </section>
  )
}
