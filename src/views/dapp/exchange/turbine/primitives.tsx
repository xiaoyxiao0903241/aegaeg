/**
 * Turbine 袋 UI 零件：等值买入单元、机制说明卡、提取冷却卡。
 */
import type { ReactNode } from 'react'

import { StatusBadge } from '~/shared/components/badge'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { CountdownValue } from '~/shared/components/countdown-value'
import { Icon } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { useWallClockSec } from '~/stores/wall-clock-store'

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
    <div className="flex h-full min-w-0 flex-col gap-1.5 rounded-control bg-background p-3">
      <Text as="p" variant="support" className="text-foreground/40">
        {label}
      </Text>
      <div className="flex min-w-0 items-center gap-2">
        <Icon alt="" className="size-5 shrink-0 rounded-md" size="token" src={icon} />
        <Text
          as="span"
          variant="copy"
          className="min-w-0 text-base/5 font-semibold wrap-break-word"
        >
          <CountValue text={value} />
        </Text>
      </div>
      <Text as="p" variant="support" className="mt-auto min-w-0 text-foreground/40">
        {footer}
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

/**
 * 涡轮提取卡：金额、冷却状态、剩余时间（到分钟）、提取按钮。
 *
 * 按钮是否可点只看链上已到期；倒计时仅展示用。
 */
export function TurbineClaimCard({
  amountLabel,
  claimLabel,
  claimableLabel,
  coolingLabel,
  cooldownDoneLabel,
  countdownLabel,
  disabled,
  hourUnit,
  icon,
  loading,
  minuteUnit,
  onClaim,
  unlockAt,
  vested,
}: {
  amountLabel: string
  claimLabel: string
  claimableLabel: string
  coolingLabel: string
  cooldownDoneLabel: string
  countdownLabel: string
  disabled: boolean
  hourUnit: string
  icon: string
  loading: boolean
  minuteUnit: string
  onClaim: () => void
  unlockAt: bigint
  vested: boolean
}) {
  const nowSec = useWallClockSec(!vested)
  const unlockAtSec = Number(unlockAt)
  const remainingSec = !Number.isFinite(unlockAtSec) ? null : Math.max(0, unlockAtSec - nowSec)

  return (
    <Card as="div" className="grid gap-3" surface="outlined">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Icon alt="" className="rounded-full" size="token" src={icon} />
          <Text as="strong" className="font-semibold" variant="detail">
            <CountValue text={amountLabel} />
          </Text>
        </div>
        <StatusBadge tone={vested ? 'pending' : 'muted'}>
          {vested ? claimableLabel : coolingLabel}
        </StatusBadge>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Text as="span" className="text-foreground/40" variant="support">
          {countdownLabel}
        </Text>
        {vested ? (
          <Text as="span" className="font-semibold" tone="success" variant="support">
            {cooldownDoneLabel}
          </Text>
        ) : (
          <Text as="span" className="font-semibold" variant="support">
            <CountdownValue
              className="gap-x-0.5"
              labels={{ hours: hourUnit, minutes: minuteUnit }}
              totalSec={remainingSec}
              units={['hours', 'minutes']}
            />
          </Text>
        )}
      </div>
      <MainButton
        density="card"
        disabled={disabled}
        loading={loading}
        onClick={onClaim}
        variant="primary"
      >
        {claimLabel}
      </MainButton>
    </Card>
  )
}
