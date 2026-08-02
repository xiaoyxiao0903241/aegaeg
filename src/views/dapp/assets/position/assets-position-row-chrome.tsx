import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
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
  remainingValue,
}: {
  periodLabel: string
  remainingLabel: string
  remainingAt: bigint
  /** 活期可随时赎回等文案；缺省且 remainingAt=0 显示 — */
  remainingValue?: string
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
          {remainingValue ?? (remainingAt > 0n ? formatBlockTime(Number(remainingAt)) : '—')}
        </Text>
      </div>
    </div>
  )
}

/** Principal column with optional soft badge（锁 icon · Figma chip）. */
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
          <DappIcon alt="" className="size-3" src={dappAssets.assetsPositionLock} />
          <Text as="span" className="leading-none text-primary" variant="support">
            {badgeText}
          </Text>
        </span>
      ) : null}
    </div>
  )
}

/** Yield chip 内双上箭头 · Figma `4525:253`. */
export function AssetsPositionBoostBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex h-5.25 w-fit items-center gap-1 rounded-control bg-primary-soft px-2">
      <DappIcon alt="" className="size-3" src={dappAssets.assetsPositionBoost} />
      <Text as="span" className="leading-none text-primary" variant="support">
        {text}
      </Text>
    </span>
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
