import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

const sectionHeadClass =
  'section-head mx-auto max-w-192 text-center max-dapp:w-full max-dapp:max-w-96 max-dapp:pb-1'

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
      <Text as="p" className="m-0 normal-case tracking-[1.82px] max-dapp:tracking-[1.68px]" tone="primary" variant="kicker">
        {eyebrow}
      </Text>
      <Text
        as="h2"
        className={cn(
          'mx-auto mt-3.5 max-w-192 text-4xl leading-tight max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-2xl max-dapp:leading-snug max-dapp:text-balance',
          titleClassName,
        )}
        variant="section"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          as="span"
          className={cn(
            'mx-auto mt-3.5 block max-w-176 max-dapp:mt-2.5 max-dapp:max-w-96',
            subtitleClassName,
          )}
          tone="foreground"
          variant="meta"
        >
          {subtitle}
        </Text>
      ) : null}
    </div>
  )
}
