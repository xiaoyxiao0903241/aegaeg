import { formatTokenAmount } from '~/core/exchange/token-amount'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import type { AssetsBondRow } from '~/web3/assets/assets-read'
import { AssetsPositionRowActions } from '~/views/dapp/assets/position/assets-position-row-actions'
import {
  ASSETS_POSITION_AGX_DECIMALS,
  ASSETS_POSITION_GAGX_DECIMALS,
  AssetsPositionPrincipalColumn,
  AssetsPositionRowHeader,
  AssetsPositionYieldColumn,
  type AssetsPositionRowShellProps,
} from '~/views/dapp/assets/position/assets-position-row-chrome'

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
  const voucher = `${row.depository.slice(0, 6)}…${row.depository.slice(-4)}`

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <AssetsPositionRowHeader
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
      <div className="flex items-center justify-end gap-1">
        <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
          {t.assets.position.voucher}
        </Text>
        <Text as="span" className="text-xs" variant="detail">
          {voucher}
        </Text>
      </div>
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
