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
import type { AssetsBondRow } from '~/web3/assets/assets-read'

export function AssetsPositionBondRow({
  formatPeriodLabel,
  formatAmount,
  locked,
  busy,
  onClaim,
  onRedeem,
  row,
}: AssetsPositionRowShellProps<AssetsBondRow>) {
  const { messages: t } = useI18n()
  // 测试期放开领取入口；profit=0 时弹窗仍可开，写链 dual-check 诚实失败
  const canClaim = true
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
          amountText={formatAmount(row.payoutRemaining, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeText={formatAmount(row.pendingPayout, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeVisible={row.pendingPayout > 0n}
          label={t.assets.position.bondPrincipal}
        />
        <AssetsPositionYieldColumn
          amountText={formatAmount(row.profit, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
          badge={
            // Bond 无独立加成字段；占位保持与质押卡双列数字对齐
            <AssetsPositionBoostBadge
              className="pointer-events-none opacity-0"
              text={formatAmount(0n, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
            />
          }
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
