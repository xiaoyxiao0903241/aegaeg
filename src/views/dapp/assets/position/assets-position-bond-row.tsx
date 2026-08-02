import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/ui/card'
import { AssetsPositionRowActions } from '~/views/dapp/assets/position/assets-position-row-actions'
import {
  ASSETS_POSITION_AGX_DECIMALS,
  ASSETS_POSITION_GAGX_DECIMALS,
  AssetsPositionPrincipalColumn,
  AssetsPositionRowHeader,
  type AssetsPositionRowShellProps,
  AssetsPositionYieldColumn,
} from '~/views/dapp/assets/position/assets-position-row-chrome'
import { AssetsPositionVoucherLink } from '~/views/dapp/assets/position/assets-position-voucher-link'
import type { AssetsBondRow } from '~/web3/assets/assets-read'

export function AssetsPositionBondRow({
  formatPeriodLabel,
  formatRewardUsd,
  locked,
  busy,
  quote,
  onClaim,
  onRedeem,
  row,
}: AssetsPositionRowShellProps<AssetsBondRow>) {
  const { messages: t } = useI18n()
  const canClaim = row.profit > 0n
  const canRedeem = row.pendingPayout > 0n
  const periodLabel = formatPeriodLabel(String(row.period))
  const dayUnit = t.assets.claim.releaseDays.replace('{days}', '').trim()

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <AssetsPositionRowHeader
        dayUnit={dayUnit}
        periodLabel={periodLabel}
        remainingAt={row.vestingEndTime}
        remainingLabel={t.assets.position.remaining}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={`${formatTokenAmount(row.payoutRemaining, ASSETS_POSITION_AGX_DECIMALS, 2)} AGX`}
          badgeText={
            row.pendingPayout > 0n
              ? `${formatTokenAmount(row.pendingPayout, ASSETS_POSITION_AGX_DECIMALS, 2)} AGX`
              : undefined
          }
          label={t.assets.position.bondPrincipal}
        />
        <AssetsPositionYieldColumn
          amountText={`${formatTokenAmount(row.profit, ASSETS_POSITION_GAGX_DECIMALS, 2)} gAGX`}
          quoteUsd={quote === 'usd' ? formatRewardUsd(row.profit) : undefined}
          yieldLabel={t.assets.position.yield}
        />
      </div>
      <AssetsPositionVoucherLink address={row.depository} label={t.assets.position.voucher} />
      <AssetsPositionRowActions
        busy={busy}
        canClaim={canClaim}
        canRedeem={canRedeem}
        claimLabel={t.assets.position.claim}
        locked={locked}
        onClaim={() => onClaim(row)}
        onRedeem={() => onRedeem(row)}
        redeemLabel={t.assets.position.redeem}
      />
    </Card>
  )
}
