import { useEffect, useState } from 'react'

import { DappActionButton } from '~/app/shell/dapp-action-button'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

function formatWarmupCountdown(endTime: bigint, nowSec: number): string {
  const left = Math.max(0, Number(endTime) - nowSec)
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export type AssetsXminePositionCardProps = {
  periodPill: string
  remainingCaption: string
  lockedPrefix: string
  activateWarmupLabel: string
  redeemAnytimeLabel: string
  stakedCaption: string
  outputCaption: string
  voucherCaption: string
  voucher: string
  claimLabel: string
  redeemLabel: string
  quote: 'agx' | 'usd'
  miningStake: bigint
  pending: bigint
  gons: bigint
  warmupGons: bigint
  warmupEndTime: bigint
  busy: boolean
  locked: boolean
  onClaim: () => void
  onActivateWarmup: () => void
  onRequestUnstake: () => void
}

/**
 * 持仓卡叶子：1Hz warmup 钟只活在此组件，不拖父级 widget/header/toolbar。
 */
export function AssetsXminePositionCard({
  periodPill,
  remainingCaption,
  lockedPrefix,
  activateWarmupLabel,
  redeemAnytimeLabel,
  stakedCaption,
  outputCaption,
  voucherCaption,
  voucher,
  claimLabel,
  redeemLabel,
  quote,
  miningStake,
  pending,
  gons,
  warmupGons,
  warmupEndTime,
  busy,
  locked,
  onClaim,
  onActivateWarmup,
  onRequestUnstake,
}: AssetsXminePositionCardProps) {
  const inWarmup = warmupGons > 0n
  const [nowSec, setNowSec] = useState(0)

  useEffect(() => {
    if (!inWarmup) return
    const tick = () => setNowSec(Math.floor(Date.now() / 1000))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [inWarmup, warmupEndTime])

  const inWarmupLocked = inWarmup && (nowSec === 0 || nowSec < Number(warmupEndTime))
  const warmupReady = inWarmup && nowSec > 0 && nowSec >= Number(warmupEndTime)
  const redeemableStake = inWarmup ? 0n : miningStake
  const remainingLabel = inWarmupLocked
    ? nowSec === 0
      ? lockedPrefix
      : `${lockedPrefix} ${formatWarmupCountdown(warmupEndTime, nowSec)}`
    : warmupReady
      ? activateWarmupLabel
      : redeemAnytimeLabel

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
          {periodPill}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <Text as="span" tone="muted-foreground" variant="detail">
            {remainingCaption}
          </Text>
          <Text as="span" className="text-sm" variant="detail">
            {remainingLabel}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {stakedCaption}
          </Text>
          <Text as="strong" className="text-base font-semibold" variant="copy">
            {formatTokenAmount(miningStake, GAGX_DECIMALS, 2)} gAGX
          </Text>
          <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
            <Text as="span" className="text-xs text-primary" variant="detail">
              {formatTokenAmount(redeemableStake, GAGX_DECIMALS, 2)} gAGX
            </Text>
          </span>
        </div>
        <div className="grid justify-items-end gap-1 text-right">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {outputCaption}
          </Text>
          <Text as="strong" className="text-base font-semibold text-primary" variant="copy">
            {formatTokenAmount(pending, X_DECIMALS, 2)} X
          </Text>
          {quote === 'usd' ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              ≈ —
            </Text>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
          {voucherCaption}
        </Text>
        <Text as="span" className="text-xs" variant="detail">
          {voucher}
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {warmupReady ? (
          <DappActionButton
            className="col-span-2 h-7 min-h-7 text-xs"
            density="inverse"
            disabled={locked || busy}
            onClick={onActivateWarmup}
          >
            {activateWarmupLabel}
          </DappActionButton>
        ) : (
          <>
            <DappActionButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={pending <= 0n || inWarmup || locked || busy}
              onClick={onClaim}
            >
              {claimLabel}
            </DappActionButton>
            <DappActionButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={gons <= 0n || inWarmup || locked || busy}
              onClick={onRequestUnstake}
              variant="secondary"
            >
              {redeemLabel}
            </DappActionButton>
          </>
        )}
      </div>
    </Card>
  )
}
