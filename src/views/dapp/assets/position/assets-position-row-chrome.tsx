import type { ReactNode } from 'react'

import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Text } from '~/shared/ui/text'

export const ASSETS_POSITION_AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
export const ASSETS_POSITION_GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsPositionRowShellProps<TRow> = {
  row: TRow
  quote: 'agx' | 'usd'
  locked: boolean
  busy: boolean
  formatPeriodLabel: (period: string) => string
  formatRewardUsd: (amount: bigint) => string
  onClaim: (row: TRow) => void
  onRedeem: (row: TRow) => void
}

/** Period pill + remaining time header shared by bond/stake position rows. */
export function AssetsPositionRowHeader({
  periodLabel,
  remainingLabel,
  remainingAt,
}: {
  periodLabel: string
  remainingLabel: string
  remainingAt: bigint
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Figma period pill 24 */}
      <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs leading-none text-muted-foreground">
        {periodLabel}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
          {remainingLabel}
        </Text>
        <Text as="span" className="text-sm leading-4" variant="copy">
          {remainingAt > 0n ? formatBlockTime(Number(remainingAt)) : '—'}
        </Text>
      </div>
    </div>
  )
}

/** Principal column with optional soft badge. */
export function AssetsPositionPrincipalColumn({
  label,
  amountText,
  badgeText,
}: {
  label: string
  amountText: string
  badgeText?: string
}) {
  return (
    <div className="grid gap-1">
      <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
        {label}
      </Text>
      <Text as="strong" className="text-sm leading-5 font-semibold" variant="copy">
        {amountText}
      </Text>
      {badgeText ? (
        <span className="inline-flex h-5.25 w-fit items-center gap-1 rounded-control bg-primary-soft px-2">
          <Text as="span" className="leading-none text-primary" variant="support">
            {badgeText}
          </Text>
        </span>
      ) : null}
    </div>
  )
}

export function AssetsPositionYieldColumn({
  yieldLabel,
  amountText,
  badge,
  quoteUsd,
}: {
  yieldLabel: string
  amountText: string
  badge?: ReactNode
  quoteUsd?: string
}) {
  return (
    <div className="grid justify-items-end gap-1 text-right">
      <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
        {yieldLabel}
      </Text>
      <Text as="strong" className="text-sm leading-5 font-semibold text-primary" variant="copy">
        {amountText}
      </Text>
      {badge}
      {quoteUsd != null ? (
        <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
          {quoteUsd}
        </Text>
      ) : null}
    </div>
  )
}
