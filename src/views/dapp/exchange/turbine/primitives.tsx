/**
 * Turbine 袋 UI 零件：等值买入单元、机制说明卡。
 */
import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

/** 等值买入一侧的金额单元。 */
export function TurbineEqBuyTokenCell({
  label,
  icon,
  value,
  footer,
}: {
  label: string
  icon: string
  value: string
  footer: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-control bg-background p-3">
      <Text as="p" variant="support" className="text-foreground/40">
        {label}
      </Text>
      <div className="flex items-center gap-2">
        <Icon alt="" className="size-5 rounded-md" size="token" src={icon} />
        <Text as="span" variant="copy" className="text-base/5 font-semibold">
          <CountValue text={value} />
        </Text>
      </div>
      <Text as="p" variant="support" className="text-foreground/40">
        {typeof footer === 'string' ? <CountValue text={footer} /> : footer}
      </Text>
    </div>
  )
}

/**
 * 涡轮机制说明卡
 *
 * 一张卡写一条机制标题与正文。
 */
export function TurbineMechanismCard({ body, title }: { body: string; title: string }) {
  return (
    <Card surface="elevated" className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-card">
      <Text as="p" variant="detail" className="m-0 font-semibold">
        {title}
      </Text>
      <Text as="p" variant="copy" className="m-0 text-foreground/70">
        {body}
      </Text>
    </Card>
  )
}
