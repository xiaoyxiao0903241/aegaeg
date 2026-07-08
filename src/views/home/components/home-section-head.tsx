import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

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
    <div
      className={cn(
        'mx-auto max-w-192 text-center max-dapp:w-full max-dapp:max-w-96 max-dapp:pb-1',
        revealClass(),
        className,
      )}
      data-reveal
      data-section-head
    >
      <Text
        as="p"
        className="m-0 text-xs leading-[1.25] tracking-[1.82px] normal-case max-dapp:tracking-[1.68px]"
        tone="primary"
        variant="eyebrow"
      >
        {eyebrow}
      </Text>
      <Text
        as="h2"
        className={cn(
          'mx-auto mt-3.5 max-w-192 text-4xl leading-tight max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-2xl max-dapp:leading-[1.2] max-dapp:text-balance',
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
            'mx-auto mt-3.5 block max-w-176 text-base leading-[1.5] max-dapp:mt-2.5 max-dapp:max-w-96 max-dapp:text-sm',
            subtitleClassName,
          )}
          tone="muted-foreground"
          variant="copy"
        >
          {subtitle}
        </Text>
      ) : null}
    </div>
  )
}
