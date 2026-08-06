import type { ReactNode } from 'react'

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
} from '~/shared/api/types'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { formatBlockTime, formatNumber, TABLE_EMPTY } from '~/shared/presenters/format'

/**
 * 各类流水/持仓记录 → 表格行映射
 *
 * 统一把 API 原始记录格式化为展示用单元格数组，列序固定，
 * 数值使用 formatNumber，缺失值以 TABLE_EMPTY 占位；
 * 交易哈希走 ExplorerLink（BscScan `/tx/...`）。
 */

export type FlowLogRow = Array<string | ReactNode>

function formatAmount(raw: string): string {
  const n = Number(raw)
  if (!Number.isFinite(n)) return TABLE_EMPTY
  return formatNumber(n, { digits: 4 })
}

function formatTx(tx: string | null | undefined): ReactNode {
  return tx ? <ExplorerLink key={tx} kind="tx" value={tx} /> : TABLE_EMPTY
}

/** 资产操作 / 释放记录：[时间, 操作, 数量, 交易] */
export function mapStakeFlowLogToOpsRow(item: StakeFlowLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapBondFlowLogToOpsRow(item: BondFlowLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.payout),
    formatTx(item.tx_hash),
  ]
}

export function mapX0MiningLogToOpsRow(item: X0MiningLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    item.operation,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapBufferPoolLogToRow(item: BufferPoolLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    item.event_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapReleasePoolLogToRow(item: ReleasePoolLogItem): FlowLogRow {
  return [
    formatBlockTime(item.event_time),
    item.event_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapTurbineLogToOpsRow(item: TurbineLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    item.turbine_type,
    formatAmount(item.amount),
    formatTx(item.tx_hash),
  ]
}

export function mapStakePositionToAsideRow(item: StakePositionItem): FlowLogRow {
  const amount = Number(item.amount)
  const amountLabel = Number.isFinite(amount)
    ? formatNumber(amount, { digits: 2, suffix: ' AGX' })
    : TABLE_EMPTY
  const pctRaw = Number(item.released_pct)
  const pctLabel = Number.isFinite(pctRaw) ? `${formatNumber(pctRaw, { digits: 1 })}%` : TABLE_EMPTY
  const termLabel =
    item.term_days <= 0
      ? '活期'
      : `${formatNumber(item.term_days, { digits: 0, trimZeros: true })} 天`
  return [
    formatBlockTime(item.block_time),
    termLabel,
    amountLabel,
    pctLabel,
    formatTx(item.tx_hash),
  ]
}

export function mapBondPurchaseToAsideRow(item: BondPurchaseItem): FlowLogRow {
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

export function mapAgxContributionBurnLogToRow(item: AgxContributionBurnLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    formatAmount(item.burned_agx),
    formatAmount(item.contribution_earned),
    formatTx(item.tx_hash),
  ]
}

export function mapAgxContributionConsumeLogToRow(item: AgxContributionConsumeLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    formatAmount(item.contribution_consumed),
    formatTx(item.tx_hash),
  ]
}
