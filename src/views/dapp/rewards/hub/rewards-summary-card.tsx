/**
 * 奖励总览摘要卡
 *
 * 含 pill CTA、装饰图、图标主值等特制槽；手册 OUT，不进 Tile。
 */
import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type RewardsSummaryCardProps = {
  label: string
  value?: string
  approx?: string
  iconSrc?: string
  mutedBody?: string
  decoSrc?: string
  labelAction?: ReactNode
}

export function RewardsSummaryCard({
  approx,
  decoSrc,
  iconSrc,
  label,
  labelAction,
  mutedBody,
  value,
}: RewardsSummaryCardProps) {
  return (
    <Card
      as="div"
      className={cn('flex flex-col gap-1.5', decoSrc != null ? 'relative overflow-hidden' : null)}
      surface="elevated"
    >
      {labelAction != null ? (
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <Text
            as="p"
            className="min-w-0 leading-none font-medium wrap-break-word text-foreground/70"
            variant="copy"
          >
            {label}
          </Text>
          {labelAction}
        </div>
      ) : (
        <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
          {label}
        </Text>
      )}
      {value != null ? (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          {iconSrc != null ? (
            <Icon alt="" className="size-4.5 shrink-0" size="sm" src={iconSrc} />
          ) : null}
          <Text as="p" className="leading-none font-semibold wrap-break-word" variant="headline">
            <CountValue text={value} />
          </Text>
          {approx != null ? (
            <Text as="p" className="leading-none wrap-break-word text-foreground/40" variant="copy">
              <CountValue text={approx} />
            </Text>
          ) : null}
        </div>
      ) : null}
      {mutedBody != null ? (
        <Text as="p" className="leading-none wrap-break-word text-foreground/40" variant="copy">
          {mutedBody}
        </Text>
      ) : null}
      {decoSrc != null ? (
        // 装饰图：水平翻转朝右，超出卡片圆角部分裁掉
        <img
          alt=""
          className="pointer-events-none absolute top-1.5 right-0 w-16 -scale-x-100 object-contain object-right max-dapp:hidden"
          src={decoSrc}
        />
      ) : null}
    </Card>
  )
}
