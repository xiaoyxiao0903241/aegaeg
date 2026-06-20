import type { ReactNode } from 'react'
import { Text } from '~/components/text'
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
        'mt-8 max-dapp:mt-6 group-data-[tab=rewards]/shell:max-dapp:mt-5.5',
        revealClass(),
        className,
      )}
      data-reveal
    >
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className="tracking-[-0.36px] max-dapp:text-base max-dapp:tracking-[-0.68px]"
      >
        {title}
      </Text>
      {children}
    </section>
  )
}
