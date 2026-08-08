import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { CountdownValue } from '~/shared/components/countdown-value'
import { Icon } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useWallClockSec } from '~/stores/wall-clock-store'
import { AssetsPositionVoucherLink } from '~/views/dapp/assets/position/primitives'

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
  const inWarmup = warmupGons > ZERO_BI
  const nowSec = useWallClockSec(inWarmup)
  const inWarmupLocked = inWarmup && nowSec < Number(warmupEndTime)
  const warmupReady = inWarmup && nowSec >= Number(warmupEndTime)
  const redeemableStake = inWarmup ? ZERO_BI : miningStake
  const remainingSec = inWarmupLocked ? Math.max(0, Number(warmupEndTime) - nowSec) : 0

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
          <Text as="span" className="text-sm/4" variant="copy">
            {inWarmupLocked ? (
              <>
                {lockedPrefix}{' '}
                <CountdownValue
                  separators={[':', ':']}
                  totalSec={remainingSec}
                  units={['hours', 'minutes', 'seconds']}
                />
              </>
            ) : warmupReady ? (
              activateWarmupLabel
            ) : (
              redeemAnytimeLabel
            )}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
            {stakedCaption}
          </Text>
          <Text as="strong" className="text-sm/5 font-semibold" variant="copy">
            <CountValue text={`${formatTokenAmount(miningStake, GAGX_DECIMALS, 2)} gAGX`} />
          </Text>
          {/* 锁定徽标：与仓位卡共用锁图标 */}
          <span className="inline-flex w-fit items-center gap-1 rounded-control bg-accent px-2">
            <Icon alt="" className="size-3" src={dappAssets.assetsPositionLock} />
            <Text as="span" className="leading-none text-primary" variant="support">
              <CountValue text={`${formatTokenAmount(redeemableStake, GAGX_DECIMALS, 2)} gAGX`} />
            </Text>
          </span>
        </div>
        <div className="grid justify-items-end gap-1 text-right">
          <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
            {outputCaption}
          </Text>
          <Text as="strong" className="text-sm/5 font-semibold text-primary" variant="copy">
            <CountValue text={`${formatTokenAmount(pending, X_DECIMALS, 2)} X`} />
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
          <MainButton
            className="col-span-2 h-7 min-h-7 text-xs"
            density="inverse"
            disabled={locked || busy}
            onClick={onActivateWarmup}
          >
            {activateWarmupLabel}
          </MainButton>
        ) : (
          <>
            <MainButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={pending <= ZERO_BI || inWarmup || locked || busy}
              onClick={onClaim}
            >
              {claimLabel}
            </MainButton>
            <MainButton
              className="h-7 min-h-7 text-xs"
              density="inverse"
              disabled={gons <= ZERO_BI || inWarmup || locked || busy}
              onClick={onRequestUnstake}
              variant="secondary"
            >
              {redeemLabel}
            </MainButton>
          </>
        )}
      </div>
    </Card>
  )
}
