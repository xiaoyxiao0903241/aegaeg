import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import type { AssetsStakeRow } from '~/web3/assets/assets-read'
import { AssetsPositionRowActions } from '~/views/dapp/assets/position/assets-position-row-actions'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function AssetsPositionStakeRow({
  formatPeriodLabel,
  formatRewardUsd,
  locked,
  busy,
  quote,
  onClaim,
  onRedeem,
  row,
}: {
  row: AssetsStakeRow
  quote: 'agx' | 'usd'
  locked: boolean
  busy: boolean
  formatPeriodLabel: (period: string) => string
  formatRewardUsd: (amount: bigint) => string
  onClaim: (row: AssetsStakeRow) => void
  onRedeem: (row: AssetsStakeRow) => void
}) {
  const { messages: t } = useI18n()
  const reward = row.blockReward + row.extraInterest
  const canClaim = reward > 0n
  const canRedeem = row.kind === 'liquid' ? row.principal > 0n : row.claimableBalance > 0n
  const periodLabel = formatPeriodLabel(row.period)
  const voucher =
    row.kind === 'locked' && row.pool ? `${row.pool.slice(0, 6)}…${row.pool.slice(-4)}` : null

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
            {row.expiry > 0n ? formatBlockTime(Number(row.expiry)) : '—'}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {t.assets.position.staked}
          </Text>
          <Text as="strong" className="text-base font-semibold" variant="copy">
            {formatTokenAmount(row.principal, AGX_DECIMALS, 2)} AGX
          </Text>
          {row.releasedPrincipal > 0n ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
              <Text as="span" className="text-xs text-primary" variant="detail">
                {formatTokenAmount(row.releasedPrincipal, AGX_DECIMALS, 2)} AGX
              </Text>
            </span>
          ) : null}
        </div>
        <div className="grid justify-items-end gap-1 text-right">
          <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
            {t.assets.position.yield}
          </Text>
          <Text as="strong" className="text-base font-semibold text-primary" variant="copy">
            {formatTokenAmount(reward, GAGX_DECIMALS, 2)} gAGX
          </Text>
          {row.extraInterest > 0n ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
              <Text as="span" className="text-xs text-primary" variant="detail">
                {formatTokenAmount(row.extraInterest, GAGX_DECIMALS, 2)} gAGX
              </Text>
            </span>
          ) : null}
          {quote === 'usd' ? (
            <Text as="span" tone="muted-foreground" variant="detail">
              {formatRewardUsd(reward)}
            </Text>
          ) : null}
        </div>
      </div>
      {voucher ? (
        <div className="flex items-center justify-end gap-1">
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
