import type { ReactNode } from 'react'

import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * 首页区块标题
 *
 * 居中排版：眉题 + 主标题 + 可选副标题，整体带渐显动画。
 *
 * @param eyebrow 眉题文案
 * @param title 主标题
 * @param subtitle 可选副标题
 */
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
        'mx-auto max-w-3xl text-center max-dapp:w-full max-dapp:max-w-96 max-dapp:pb-1',
        revealClass(),
        className,
      )}
      data-reveal
      data-section-head
    >
      <Text as="p" className="m-0 text-xs/tight normal-case" tone="primary" variant="eyebrow">
        {eyebrow}
      </Text>
      <Text
        as="h2"
        className={cn(
          'mx-auto mt-3.5 max-w-3xl text-4xl/tight max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-2xl max-dapp:leading-[1.2] max-dapp:text-balance',
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
            'mx-auto mt-3.5 block max-w-176 text-base/normal max-dapp:mt-2.5 max-dapp:max-w-96 max-dapp:text-sm',
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
