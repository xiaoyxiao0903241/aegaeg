import { DappActionButton } from '~/app/shell/dapp-action-button'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import type { AssetsBondRow } from '~/web3/assets/assets-read'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function AssetsPositionBondRow({
  formatPeriodLabel,
  formatRewardUsd,
  locked,
  busy,
  quote,
  onClaim,
  onRedeem,
  row,
}: {
  row: AssetsBondRow
  quote: 'agx' | 'usd'
  locked: boolean
  busy: boolean
  formatPeriodLabel: (period: string) => string
  formatRewardUsd: (amount: bigint) => string
  onClaim: (row: AssetsBondRow) => void
  onRedeem: (row: AssetsBondRow) => void
}) {
  const { messages: t } = useI18n()
  const canClaim = row.profit > 0n
  const canRedeem = row.pendingPayout > 0n
  const periodLabel = formatPeriodLabel(String(row.period))
  const voucher = `${row.depository.slice(0, 6)}…${row.depository.slice(-4)}`

  return (
    <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
          {periodLabel}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.assets.position.remaining}
          </Text>
          <Text as="span" className="text-sm" variant="detail">
            {row.vestingEndTime > 0n ? formatBlockTime(Number(row.vestingEndTime)) : '—'}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {t.assets.position.bondPrincipal}
          </Text>
          <Text as="strong" className="text-base font-semibold" variant="copy">
            {formatTokenAmount(row.payoutRemaining, AGX_DECIMALS, 2)} AGX
          </Text>
          {row.pendingPayout > 0n ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
              <Text as="span" className="text-xs text-primary" variant="detail">
                {formatTokenAmount(row.pendingPayout, AGX_DECIMALS, 2)} AGX
              </Text>
            </span>
          ) : null}
        </div>
        <div className="grid justify-items-end gap-1 text-right">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {t.assets.position.yield}
          </Text>
          <Text as="strong" className="text-base font-semibold text-primary" variant="copy">
            {formatTokenAmount(row.profit, GAGX_DECIMALS, 2)} gAGX
          </Text>
          {quote === 'usd' ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {formatRewardUsd(row.profit)}
            </Text>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
          {t.assets.position.voucher}
        </Text>
        <Text as="span" className="text-xs" variant="detail">
          {voucher}
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DappActionButton
          className="h-7 min-h-7 text-xs"
          density="inverse"
          disabled={!canClaim || locked || busy}
          onClick={() => onClaim(row)}
        >
          {t.assets.position.claim}
        </DappActionButton>
        <DappActionButton
          className="h-7 min-h-7 text-xs"
          density="inverse"
          disabled={!canRedeem || locked || busy}
          onClick={() => onRedeem(row)}
          variant="secondary"
        >
          {t.assets.position.redeem}
        </DappActionButton>
      </div>
    </Card>
  )
}
