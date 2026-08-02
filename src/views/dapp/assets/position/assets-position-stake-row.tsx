import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/ui/card'
import { AssetsPositionRowActions } from '~/views/dapp/assets/position/assets-position-row-actions'
import {
  ASSETS_POSITION_AGX_DECIMALS,
  ASSETS_POSITION_GAGX_DECIMALS,
  AssetsPositionBoostBadge,
  AssetsPositionPrincipalColumn,
  AssetsPositionRowHeader,
  type AssetsPositionRowShellProps,
  AssetsPositionYieldColumn,
} from '~/views/dapp/assets/position/assets-position-row-chrome'
import { AssetsPositionVoucherLink } from '~/views/dapp/assets/position/assets-position-voucher-link'
import type { AssetsStakeRow } from '~/web3/assets/assets-read'

export function AssetsPositionStakeRow(props: AssetsPositionRowShellProps<AssetsStakeRow>) {
  const { formatPeriodLabel, formatRewardUsd, locked, busy, quote, onClaim, onRedeem, row } = props
  const { messages: t } = useI18n()
  const reward = row.blockReward + row.extraInterest
  const inWarmup = Boolean(row.inWarmup)
  const canClaim = !inWarmup && reward > 0n
  const canRedeem =
    row.kind === 'liquid' ? !inWarmup && row.principal > 0n : row.claimableBalance > 0n
  const periodLabel = formatPeriodLabel(row.period)
  const voucherAddress = row.kind === 'locked' && row.pool ? row.pool : null
  // 活期 expiry 为 epoch 编号，勿当 unix；非 warmup →「随时可赎回」
  const remainingValue = inWarmup
    ? t.assets.blocked.warmupActive
    : row.kind === 'liquid'
      ? t.assets.position.redeemAnytime
      : undefined
  const dayUnit = t.assets.claim.releaseDays.replace('{days}', '').trim()

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <AssetsPositionRowHeader
        dayUnit={dayUnit}
        periodLabel={periodLabel}
        remainingAt={row.expiry}
        remainingLabel={t.assets.position.remaining}
        remainingValue={remainingValue}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={`${formatTokenAmount(row.principal, ASSETS_POSITION_AGX_DECIMALS, 2)} AGX`}
          badgeText={
            row.releasedPrincipal > 0n
              ? `${formatTokenAmount(row.releasedPrincipal, ASSETS_POSITION_AGX_DECIMALS, 2)} AGX`
              : undefined
          }
          label={t.assets.position.staked}
        />
        <AssetsPositionYieldColumn
          amountText={`${formatTokenAmount(reward, ASSETS_POSITION_GAGX_DECIMALS, 2)} gAGX`}
          badge={
            // 稿 boost chip：有加成显示；无加成仍占位 opacity-0（禁砍 chrome）
            <AssetsPositionBoostBadge
              className={row.extraInterest > 0n ? undefined : 'pointer-events-none opacity-0'}
              text={`${formatTokenAmount(row.extraInterest, ASSETS_POSITION_GAGX_DECIMALS, 2)} gAGX`}
            />
          }
          quoteUsd={quote === 'usd' ? formatRewardUsd(reward) : undefined}
          yieldLabel={t.assets.position.yield}
        />
      </div>
      {voucherAddress ? (
        <AssetsPositionVoucherLink address={voucherAddress} label={t.assets.position.voucher} />
      ) : null}
      <AssetsPositionRowActions
        busy={busy}
        canClaim={canClaim}
        canRedeem={canRedeem}
        claimLabel={t.assets.position.claim}
        locked={locked}
        onClaim={() => onClaim(row)}
        onRedeem={() => onRedeem(row)}
        redeemLabel={row.kind === 'liquid' ? t.assets.position.unlock : t.assets.position.redeem}
      />
    </Card>
  )
}
