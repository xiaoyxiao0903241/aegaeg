import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

const sectionHeadClass =
  'section-head mx-auto max-w-[760px] text-center max-dapp:w-full max-dapp:max-w-[362px] max-dapp:pb-1'

export function HomeSectionHead({
  eyebrow,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}) {
  return (
    <div className={cn(sectionHeadClass, revealClass(), className)} data-reveal>
      <Text
        as="p"
        size="sm"
        weight="semibold"
        tone="coral"
        className="m-0 text-[13px] leading-[1.25] tracking-[1.82px] text-primary max-dapp:text-xs max-dapp:tracking-[1.68px]"
      >
        {eyebrow}
      </Text>
      <Text
        as="h2"
        size="display"
        weight="semibold"
        className={cn(
          'mx-auto mt-3.5 max-w-[760px] max-dapp:mt-2.5 max-dapp:text-[26px] max-dapp:leading-[1.2]',
          titleClassName,
        )}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          as="span"
          size="md"
          tone="body"
          className={cn(
            'mx-auto mt-3.5 block max-w-[680px] text-[17px] leading-[1.5] max-dapp:mt-2.5 max-dapp:max-w-[362px] max-dapp:text-sm',
            subtitleClassName,
          )}
        >
          {subtitle}
        </Text>
      ) : null}
    </div>
  )
}
