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
      <Text as="p" className="m-0" variant="home-eyebrow">
        {eyebrow}
      </Text>
      <Text
        as="h2"
        className={cn(
          'mx-auto mt-3.5 max-w-192 max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-balance',
          titleClassName,
        )}
        tone="primary"
        variant="home-display"
        weight="semibold"
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
          tone="primary"
          variant="home-lead"
        >
          {subtitle}
        </Text>
      ) : null}
    </div>
  )
}
