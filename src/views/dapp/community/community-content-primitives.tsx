import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { communityStatCardMobileShell } from '~/app/shell/skeleton'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

const communityStatCard = tv({
  slots: {
    // 普通态用 elevated 白卡，深色态用 inverse 暗卡
    root: cn(
      revealClass(),
      'community-stat relative flex flex-col items-start gap-1 overflow-clip rounded-2xl p-4',
      communityStatCardMobileShell(),
    ),
    label: cn('relative z-1', 'max-dapp:w-full'),
    value: cn('relative z-1', 'max-dapp:mt-1 max-dapp:w-full'),
    volume: cn('relative z-1', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full'),
  },
  variants: {
    dark: {
      true: {
        root: 'is-dark border-0 shadow-none',
      },
      false: {},
    },
    withImage: {
      true: { root: 'overflow-clip' },
      false: {},
    },
  },
  defaultVariants: {
    dark: false,
    withImage: false,
  },
})

/**
 * 社区统计卡
 *
 * 展示标签、数值与业绩/等级说明；深色模式换反色底，可带右下角装饰图。
 */
export function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  const styles = communityStatCard({
    dark,
    withImage: Boolean(image),
  })

  return (
    <Card
      as="article"
      className={cn(styles.root(), className)}
      data-reveal
      surface={dark ? 'inverse' : 'elevated'}
    >
      <Text
        as="span"
        className={cn(styles.label(), !dark && 'text-foreground/70')}
        tone={dark ? 'inverse-muted' : undefined}
        variant="support"
      >
        {label}
      </Text>
      <Text
        as="strong"
        className={cn(styles.value(), 'text-2xl leading-7 font-semibold tracking-tight')}
        tone={dark ? 'inverse' : 'foreground'}
        variant="figure"
      >
        {value}
      </Text>
      {volume ? (
        <Text
          as="b"
          className={cn(
            styles.volume(),
            'text-sm leading-tight font-medium',
            !dark && 'text-primary',
          )}
          tone={dark ? 'primary-bright' : undefined}
          variant="support"
        >
          {volume}
        </Text>
      ) : null}
      {children}
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute -right-1 bottom-0 z-0 h-auto w-17 object-contain object-bottom"
          data-slot-id="community-stat-rank-deco"
          height="103"
          loading="lazy"
          src={image}
          width="68"
        />
      ) : null}
    </Card>
  )
}
