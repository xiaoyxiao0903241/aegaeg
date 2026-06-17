import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function DappContentHeading({
  children,
  className,
  id,
  reveal = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  reveal?: boolean
}) {
  return (
    <Text
      as="h2"
      size="lg"
      weight="semibold"
      className={cn(
        'm-0 tracking-[-0.36px]',
        'max-[820px]:mt-0 max-[820px]:text-[17px] max-[820px]:tracking-[-0.68px]',
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
