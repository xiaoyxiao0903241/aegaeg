import { useEffect, useState } from 'react'

import { dappAssets } from '~/app/assets'
import { CtaButton } from '~/app/shell/cta-button'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { AssetsPositionVoucherLink } from '~/views/dapp/assets/position/primitives'

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
  voucherAddress: string
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

/** X 挖矿持仓卡：warmup 倒计时只在此组件内运行，避免拖累外层页面 */
export function AssetsXminePositionCard({
  periodPill,
  remainingCaption,
  lockedPrefix,
  activateWarmupLabel,
  redeemAnytimeLabel,
  stakedCaption,
  outputCaption,
  voucherCaption,
  voucherAddress,
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
    <Card surface="outlined" className="grid gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-muted px-3 text-xs leading-none text-muted-foreground">
          {periodPill}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
            {remainingCaption}
          </Text>
          <Text as="span" className="text-sm leading-4" variant="copy">
            {remainingLabel}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
            {stakedCaption}
          </Text>
          <Text as="strong" className="text-sm leading-5 font-semibold" variant="copy">
            {formatTokenAmount(miningStake, GAGX_DECIMALS, 2)} gAGX
          </Text>
          {/* 锁定徽标：与仓位卡共用锁图标 */}
          <span className="inline-flex w-fit items-center gap-1 rounded-control bg-primary-soft px-2">
            <Icon alt="" className="size-3" src={dappAssets.assetsPositionLock} />
            <Text as="span" className="leading-none text-primary" variant="support">
              {formatTokenAmount(redeemableStake, GAGX_DECIMALS, 2)} gAGX
            </Text>
          </span>
        </div>
        <div className="grid justify-items-end gap-1 text-right">
          <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
            {outputCaption}
          </Text>
          <Text as="strong" className="text-sm leading-5 font-semibold text-primary" variant="copy">
            {formatTokenAmount(pending, X_DECIMALS, 2)} X
          </Text>
          {quote === 'usd' ? (
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              ≈ —
            </Text>
          ) : null}
        </div>
      </div>
      {/* 凭证行：左对齐，不用右对齐 */}
      <AssetsPositionVoucherLink address={voucherAddress} label={voucherCaption} />
      <div className="grid grid-cols-2 gap-3">
        {warmupReady ? (
          <CtaButton
            className="col-span-2 h-7 min-h-7 text-xs"
            density="inverse"
            disabled={locked || busy}
            onClick={onActivateWarmup}
          >
            {activateWarmupLabel}
          </CtaButton>
        ) : (
          <>
            <CtaButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={pending <= 0n || inWarmup || locked || busy}
              onClick={onClaim}
            >
              {claimLabel}
            </CtaButton>
            <CtaButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={gons <= 0n || inWarmup || locked || busy}
              onClick={onRequestUnstake}
              variant="secondary"
            >
              {redeemLabel}
            </CtaButton>
          </>
        )}
      </div>
    </Card>
  )
}
