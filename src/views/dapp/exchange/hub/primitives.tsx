/**
 * 兑换程序入口单卡
 *
 * 无点击时渲染为 article；禁用不用 HTML disabled，以免破坏悬浮抬升。
 */
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

const exchangeProgramCard = tv({
  // 去掉卡片默认内边距，改成更紧凑的左右与上下留白
  base: 'flex w-full p-0 px-4 py-3 text-left',
  variants: {
    hasIcon: {
      true: 'items-center justify-between gap-2',
      false: 'flex-col items-start justify-center gap-1.5',
    },
    interactive: {
      true: 'duration-dapp-fast cursor-pointer transition-[transform,box-shadow] ease-out hover:scale-[1.008] active:scale-[0.992]',
      false: null,
    },
  },
})

function ProgramCoinIcon({ icon }: { icon: readonly [string] | readonly [string, string] }) {
  if (icon.length === 1) {
    return (
      <img
        alt=""
        className="size-7 shrink-0 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
    )
  }

  // 双币叠加需外层固定高度：绝对定位不占文档流，否则高度塌成 0
  return (
    <span className="relative flex h-7 w-13 shrink-0 items-center">
      <img
        alt=""
        className="absolute top-0 left-0.5 size-7 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
      <img
        alt=""
        className="absolute top-0 left-6 size-7 rounded-md object-cover"
        height={28}
        src={icon[1]}
        width={28}
      />
    </span>
  )
}

export function ExchangeProgramCard({
  body,
  icon,
  onClick,
  title,
}: {
  body: string
  /** 1 个为单币图 · 2 个为叠加双币 · 不传为纯文字。 */
  icon?: readonly [string] | readonly [string, string]
  onClick?: () => void
  title: string
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as={interactive ? 'button' : 'article'}
      surface="elevated"
      className={cn(exchangeProgramCard({ hasIcon: Boolean(icon), interactive }))}
      {...(interactive ? { onClick, type: 'button' as const } : {})}
    >
      <Card.Content className={cn('grid min-w-0 gap-1.5 text-left', icon && 'flex-1')}>
        <Text as="strong" className="leading-tight font-semibold wrap-break-word" variant="detail">
          {title}
        </Text>
        <Text as="span" className="leading-tight wrap-break-word text-foreground/40" variant="copy">
          {body}
        </Text>
      </Card.Content>
      {icon ? <ProgramCoinIcon icon={icon} /> : null}
    </Card>
  )
}
