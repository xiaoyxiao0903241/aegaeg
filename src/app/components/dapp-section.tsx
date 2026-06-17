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
        'mt-8 max-[820px]:mt-6 group-data-[tab=rewards]/shell:max-[820px]:mt-[22px]',
        revealClass(),
        className,
      )}
      data-reveal
    >
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className="tracking-[-0.36px] max-[820px]:text-[17px] max-[820px]:tracking-[-0.68px]"
      >
        {title}
      </Text>
      {children}
    </section>
  )
}
