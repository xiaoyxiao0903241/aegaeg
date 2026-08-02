import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
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
  const voucher =
    row.kind === 'locked' && row.pool ? `${row.pool.slice(0, 6)}…${row.pool.slice(-4)}` : null
  const remainingValue = inWarmup
    ? t.assets.blocked.warmupActive
    : row.kind === 'liquid' && row.expiry <= 0n
      ? t.assets.position.redeemAnytime
      : undefined

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <AssetsPositionRowHeader
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
            row.extraInterest > 0n ? (
              <AssetsPositionBoostBadge
                text={`${formatTokenAmount(row.extraInterest, ASSETS_POSITION_GAGX_DECIMALS, 2)} gAGX`}
              />
            ) : null
          }
          quoteUsd={quote === 'usd' ? formatRewardUsd(reward) : undefined}
          yieldLabel={t.assets.position.yield}
        />
      </div>
      {voucher ? (
        // Figma `4525:331` vr：左对齐（禁 justify-end 推到右缘）
        <div className="flex items-center justify-start gap-1">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {t.assets.position.voucher}
          </Text>
          <Text as="span" className="text-xs" variant="detail">
            {voucher}
          </Text>
        </div>
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
