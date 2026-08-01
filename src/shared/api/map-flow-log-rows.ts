import {
  formatBlockTime,
  formatGroupedNumber,
  formatShortAddress,
  TABLE_EMPTY,
} from '~/shared/api/format-display'
import type {
  AgxContributionBurnLogItem,
  AgxContributionConsumeLogItem,
  BondFlowLogItem,
  BondPurchaseItem,
  BufferPoolLogItem,
  ReleasePoolLogItem,
  StakeFlowLogItem,
  StakePositionItem,
  TurbineLogItem,
  X0MiningLogItem,
  X0MiningPositionItem,
} from '~/shared/api/types'

function formatAmount(raw: string): string {
  const n = Number(raw)
  if (!Number.isFinite(n)) return TABLE_EMPTY
  return formatGroupedNumber(n, { digits: 4 })
}

function formatTx(tx: string | null | undefined): string {
  return tx ? formatShortAddress(tx) : TABLE_EMPTY
}

/** Assets ops / release records: [time, operation, amount, tx] */
export function mapStakeFlowLogToOpsRow(item: StakeFlowLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapBondFlowLogToOpsRow(item: BondFlowLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.payout),
    formatTx(item.tx_hash),
  ]
}

export function mapX0MiningLogToOpsRow(item: X0MiningLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapBufferPoolLogToRow(item: BufferPoolLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.event_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapReleasePoolLogToRow(item: ReleasePoolLogItem): string[] {
  return [
    formatBlockTime(item.event_time),
    item.event_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapTurbineLogToOpsRow(item: TurbineLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.turbine_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapStakePositionToAsideRow(item: StakePositionItem): string[] {
  const amount = Number(item.amount)
  const amountLabel = Number.isFinite(amount)
    ? formatGroupedNumber(amount, { digits: 2, suffix: ' AGX' })
    : TABLE_EMPTY
  const pctRaw = Number(item.released_pct)
  const pctLabel = Number.isFinite(pctRaw)
    ? `${formatGroupedNumber(pctRaw, { digits: 1 })}%`
    : TABLE_EMPTY
  const termLabel =
    item.term_days <= 0
      ? '活期'
      : `${formatGroupedNumber(item.term_days, { digits: 0, trimZeros: true })} 天`
  return [
    formatBlockTime(item.block_time),
    termLabel,
    amountLabel,
    pctLabel,
    formatTx(item.tx_hash),
  ]
}

export function mapBondPurchaseToAsideRow(item: BondPurchaseItem): string[] {
  const discount =
    item.discount_bp == null ? TABLE_EMPTY : `${(item.discount_bp / 100).toFixed(2)}%`
  return [
    formatBlockTime(item.block_time),
    String(item.term_days),
    formatAmount(item.deposit_amount),
    discount,
    formatAmount(item.payout),
    formatTx(item.tx_hash),
  ]
}

export function mapX0MiningPositionToOpsRow(item: X0MiningPositionItem): string[] {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapAgxContributionBurnLogToRow(item: AgxContributionBurnLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    formatAmount(item.burned_agx),
    formatAmount(item.contribution_earned),
    formatTx(item.tx_hash),
  ]
}

export function mapAgxContributionConsumeLogToRow(item: AgxContributionConsumeLogItem): string[] {
  return [
    formatBlockTime(item.block_time),
    formatAmount(item.contribution_consumed),
    formatTx(item.tx_hash),
  ]
}
