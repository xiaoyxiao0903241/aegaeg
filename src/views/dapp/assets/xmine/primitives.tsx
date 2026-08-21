import type { ReactNode } from 'react'

import { ZERO_BI } from '~/core/constants'
import { formatAssetsActionAmount, isAssetsActionableAmount } from '~/core/exchange/token-amount'
import { Card } from '~/shared/components/card'
import { CountdownValue } from '~/shared/components/countdown-value'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useWallClockSec } from '~/stores/wall-clock-store'
import {
  AssetsPositionPrincipalColumn,
  AssetsPositionRowActions,
  AssetsPositionRowHeader,
  AssetsPositionVoucherLink,
  AssetsPositionYieldColumn,
} from '~/views/dapp/assets/position/primitives'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

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
  warmupGons: bigint
  warmupEndTime: bigint
  busy: boolean
  locked?: boolean
  claimLocked?: boolean
  redeemLocked?: boolean
  activateLocked?: boolean
  onClaim: () => void
  onActivateWarmup: () => void
  onRequestUnstake: () => void
}

/** X 挖矿持仓卡：chrome 与质押仓位卡共用；warmup 倒计时只在此组件内跑钟 */
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
  warmupGons,
  warmupEndTime,
  busy,
  locked,
  claimLocked,
  redeemLocked,
  activateLocked,
  onClaim,
  onActivateWarmup,
  onRequestUnstake,
}: AssetsXminePositionCardProps) {
  const inWarmup = warmupGons > ZERO_BI
  const nowSec = useWallClockSec(inWarmup)
  const inWarmupLocked = inWarmup && nowSec < Number(warmupEndTime)
  const warmupReady = inWarmup && nowSec >= Number(warmupEndTime)
  const redeemableStake = inWarmup ? ZERO_BI : miningStake
  const remainingSec = inWarmupLocked ? Math.max(0, Number(warmupEndTime) - nowSec) : 0

  const remainingValue: ReactNode = inWarmupLocked ? (
    <>
      {lockedPrefix}{' '}
      <CountdownValue
        separators={[':', ':']}
        totalSec={remainingSec}
        units={['hours', 'minutes', 'seconds']}
      />
    </>
  ) : (
    redeemAnytimeLabel
  )

  const usdApproxBadge =
    quote === 'usd' ? (
      <Text as="span" className="leading-4 text-foreground/40" variant="support">
        ≈ —
      </Text>
    ) : undefined

  return (
    <Card surface="outlined" className="grid gap-2">
      <AssetsPositionRowHeader
        dayUnit=""
        periodLabel={periodPill}
        remainingAsStatus={!inWarmupLocked}
        remainingAt={ZERO_BI}
        remainingLabel={remainingCaption}
        remainingValue={remainingValue}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={`${formatAssetsActionAmount(miningStake, GAGX_DECIMALS)} gAGX`}
          badgeText={`${formatAssetsActionAmount(redeemableStake, GAGX_DECIMALS)} gAGX`}
          badgeVisible
          label={stakedCaption}
        />
        <AssetsPositionYieldColumn
          amountText={`${formatAssetsActionAmount(pending, X_DECIMALS)} X`}
          badge={usdApproxBadge}
          yieldLabel={outputCaption}
        />
      </div>
      <AssetsPositionVoucherLink address={voucherAddress} label={voucherCaption} />
      {warmupReady ? (
        <MainButton
          className="h-7 min-h-7 text-xs"
          density="inverse"
          disabled={(activateLocked ?? locked) || busy}
          onClick={onActivateWarmup}
        >
          {activateWarmupLabel}
        </MainButton>
      ) : (
        <AssetsPositionRowActions
          busy={busy}
          canClaim={isAssetsActionableAmount(pending, X_DECIMALS) && !inWarmup}
          canRedeem={isAssetsActionableAmount(miningStake, GAGX_DECIMALS) && !inWarmup}
          claimLabel={claimLabel}
          claimLocked={claimLocked}
          locked={locked}
          onClaim={onClaim}
          onRedeem={onRequestUnstake}
          redeemLabel={redeemLabel}
          redeemLocked={redeemLocked}
        />
      )}
    </Card>
  )
}
