/**
 * Hub mode UI 零件：奖励类型入口卡 + 总览摘要卡。
 */
import { type ReactNode } from 'react'

import { StatusBadge } from '~/shared/components/badge'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** 奖励类型入口卡（组合组件）：外层卡片处理可点行为；标题 / 说明 / 余额由调用方用子组件组装。 */
function TypeRoot({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <InteractiveCard className="grid gap-3" onClick={onClick}>
      {children}
    </InteractiveCard>
  )
}

function TypeHead({ children }: { children: ReactNode }) {
  return <div className="grid gap-1.5">{children}</div>
}

function TypeTitleGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-1.5">{children}</div>
}

function TypeBody({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className="m-0 wrap-break-word text-foreground/40" variant="copy">
      {children}
    </Text>
  )
}

function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <StatusBadge size="compact" tone="pending">
      {children}
    </StatusBadge>
  )
}

function TypeBalance({
  label,
  amount,
  approx,
  trailing,
}: {
  label: string
  amount: string
  approx?: string
  trailing?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
      <Text as="span" className="text-foreground/70" variant="copy">
        {label}
      </Text>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
        <Text as="strong" className="wrap-break-word" variant="headline">
          <CountValue text={amount} />
        </Text>
        {approx ? (
          <Text as="span" className="wrap-break-word text-foreground/40" variant="copy">
            <CountValue text={approx} />
          </Text>
        ) : null}
        {trailing}
      </div>
    </div>
  )
}

export const RewardsTypeCard = Object.assign(TypeRoot, {
  Head: TypeHead,
  TitleGroup: TypeTitleGroup,
  Body: TypeBody,
  Badge: TypeBadge,
  Balance: TypeBalance,
})

/** 奖励总览摘要卡：展示一项奖励数据；可带跳转按钮、右侧装饰图和币种图标。 */
export type RewardsSummaryCardProps = {
  label: string
  value?: string
  approx?: string
  iconSrc?: string
  mutedBody?: string
  decorationSrc?: string
  labelAction?: ReactNode
}

export function RewardsSummaryCard({
  approx,
  decorationSrc,
  iconSrc,
  label,
  labelAction,
  mutedBody,
  value,
}: RewardsSummaryCardProps) {
  return (
    <Card
      as="div"
      className={cn(
        'flex flex-col gap-1.5',
        decorationSrc != null ? 'relative overflow-hidden' : null,
      )}
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
      {decorationSrc != null ? (
        // 装饰图：水平翻转朝右，超出卡片圆角部分裁掉
        <img
          alt=""
          className="pointer-events-none absolute top-1.5 right-0 w-16 -scale-x-100 object-contain object-right max-dapp:hidden"
          src={decorationSrc}
        />
      ) : null}
    </Card>
  )
}
