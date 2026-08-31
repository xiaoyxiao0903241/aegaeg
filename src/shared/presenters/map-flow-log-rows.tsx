import type { ReactNode } from 'react'

import { RELEASE_DURATION_DAYS } from '~/core/assets/claim-plans'
import { formatApiContributionPoints } from '~/core/exchange/format-contribution-points'
import { PERSONAL_TOKEN_DIGITS } from '~/core/exchange/token-amount'
import { interpolate } from '~/i18n/interpolate'
import type { AppMessagesBundle } from '~/i18n/messages/app/types'
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
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  type ConsumeLogPurposeKey,
  consumeLogPurposeKey,
} from '~/shared/presenters/consume-log-purpose'
import { formatBlockTime, formatNumber, TABLE_EMPTY } from '~/shared/presenters/format'

/**
 * 各类流水/持仓记录 → 表格行映射
 *
 * 操作列文案由 i18n（`flowOps`）提供，标签跟 API 枚举；
 * 质押/债券带 `term_days` 周期后缀。金额缺数显 0；
 * 交易哈希走 ExplorerLink（BscScan `/tx/...`）。
 *
 * @see docs/backend-api/api.md stake-flow / bond-flow / x0-mining / release / turbine
 */

export type FlowLogRow = Array<string | ReactNode>

export type FlowOpsCopy = AppMessagesBundle['flowOps']

function formatAmount(
  raw: string,
  digits = PERSONAL_TOKEN_DIGITS,
  suffix = '',
  prefix = '',
  trimZeros = false,
): string {
  const n = Number(raw)
  return formatNumber(Number.isFinite(n) ? n : 0, { digits, suffix, prefix, trimZeros })
}

function formatTx(tx: string | null | undefined): ReactNode {
  return tx ? <ExplorerLink key={tx} kind="tx" value={tx} /> : TABLE_EMPTY
}

function formatTermedOp(action: string, termDays: number, copy: FlowOpsCopy): string {
  const suffix =
    termDays <= 0 ? copy.termLiquid : interpolate(copy.termDays, { n: Math.trunc(termDays) })
  return `${action}${suffix}`
}

/** 索引可能写 earlyStake；展示与单位跟 EARLY_STAKE 同一套。 */
function canonicalStakeOp(operation: string): string {
  return operation === 'earlyStake' ? 'EARLY_STAKE' : operation
}

function stakeAmountUnit(operation: StakeFlowLogItem['operation']): {
  digits: number
  suffix: string
} {
  const op = canonicalStakeOp(operation)
  return {
    digits: PERSONAL_TOKEN_DIGITS,
    suffix: op === 'STAKE' || op === 'CLAIM_PRINCIPAL' || op === 'EARLY_STAKE' ? ' AGX' : ' gAGX',
  }
}

function bondAmountUnit(operation: BondFlowLogItem['operation']): {
  digits: number
  suffix: string
} {
  return {
    digits: PERSONAL_TOKEN_DIGITS,
    suffix: operation === 'PURCHASE' || operation === 'REDEEM' ? ' AGX' : ' gAGX',
  }
}

function sameAddr(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.toLowerCase()
}

const BUFFER_GAGX_CONTRACTS = [BSC_CONTRACTS.gagx, BSC_CONTRACTS.xStakingPool] as const

/** 缓冲里会出 AGX 本金的合约；其它已登记地址不加单位，避免把 USD1 / X 猜成 AGX。 */
const BUFFER_AGX_CONTRACTS = [
  BSC_CONTRACTS.agx,
  BSC_CONTRACTS.principalReleaseVault,
  BSC_CONTRACTS.liquidStaking,
  BSC_CONTRACTS.lockedStaking180d,
  BSC_CONTRACTS.lockedStaking360d,
  BSC_CONTRACTS.lockedStaking540d,
  BSC_CONTRACTS.bondDepository180d,
  BSC_CONTRACTS.bondDepository360d,
  BSC_CONTRACTS.bondDepository540d,
  BSC_CONTRACTS.burnBondDepository180d,
  BSC_CONTRACTS.burnBondDepository360d,
  BSC_CONTRACTS.burnBondDepository540d,
  BSC_CONTRACTS.aegisSplitterManager,
  BSC_CONTRACTS.aegisSplitterHead0,
  BSC_CONTRACTS.stakingPool,
] as const

function matchesAny(addr: string, contracts: readonly string[]): boolean {
  return contracts.some((contract) => sameAddr(addr, contract))
}

/** 缓冲流水币种：白名单才加单位；未知或不在名单不加。 */
function bufferAmountUnit(contractAddress: string): { digits: number; suffix: string } {
  const addr = contractAddress.trim()
  if (!addr) return { digits: PERSONAL_TOKEN_DIGITS, suffix: '' }
  if (matchesAny(addr, BUFFER_GAGX_CONTRACTS))
    return { digits: PERSONAL_TOKEN_DIGITS, suffix: ' gAGX' }
  if (matchesAny(addr, BUFFER_AGX_CONTRACTS))
    return { digits: PERSONAL_TOKEN_DIGITS, suffix: ' AGX' }
  return { digits: PERSONAL_TOKEN_DIGITS, suffix: '' }
}

function releaseAction(item: ReleasePoolLogItem, copy: FlowOpsCopy): string {
  const action = copy.release[item.event_type] ?? item.event_type
  if (item.event_type !== 'entered_queue') return action
  const days = RELEASE_DURATION_DAYS[item.plan_index]
  if (days == null) return action
  return `${action}${interpolate(copy.termDays, { n: days })}`
}

function xmineAction(operation: string, copy: FlowOpsCopy): string {
  if (operation === 'REDEEM' || operation === 'UNSTAKE_X') return copy.xmine.UNSTAKE_X
  if (operation === 'STAKE_X') return copy.xmine.STAKE_X
  if (operation === 'REWARD') return copy.xmine.REWARD
  return operation
}

/** 资产质押操作记录：[时间, 操作, 数量, 交易] */
export function mapStakeFlowLogToOpsRow(item: StakeFlowLogItem, copy: FlowOpsCopy): FlowLogRow {
  const op = canonicalStakeOp(item.operation)
  const action = copy.stake[op as keyof FlowOpsCopy['stake']] ?? item.operation
  const amount = stakeAmountUnit(item.operation)
  const label = op === 'EARLY_STAKE' ? action : formatTermedOp(action, item.term_days, copy)
  return [
    formatBlockTime(item.block_time),
    label,
    formatAmount(item.amount, amount.digits, amount.suffix),
    formatTx(item.tx_hash),
  ]
}

/** LP / 销毁债券流水 → 操作表格行。 */
export function mapBondFlowLogToOpsRow(item: BondFlowLogItem, copy: FlowOpsCopy): FlowLogRow {
  const action = copy.bond[item.operation] ?? item.operation
  const amount = bondAmountUnit(item.operation)
  return [
    formatBlockTime(item.block_time),
    formatTermedOp(action, item.term_days, copy),
    formatAmount(item.payout, amount.digits, amount.suffix),
    formatTx(item.tx_hash),
  ]
}

/** X 挖矿流水 → 操作表格行（无周期后缀）。 */
export function mapX0MiningLogToOpsRow(item: X0MiningLogItem, copy: FlowOpsCopy): FlowLogRow {
  const isReward = item.operation === 'REWARD'
  return [
    formatBlockTime(item.block_time),
    xmineAction(item.operation, copy),
    formatAmount(item.amount, 4, isReward ? ' X' : ' gAGX'),
    formatTx(item.tx_hash),
  ]
}

/** 本金缓冲池日志 → 操作表格行。 */
export function mapBufferPoolLogToRow(item: BufferPoolLogItem, copy: FlowOpsCopy): FlowLogRow {
  const amount = bufferAmountUnit(item.contract_address)
  return [
    formatBlockTime(item.block_time),
    copy.buffer[item.event_type] ?? item.event_type,
    formatAmount(item.amount, amount.digits, amount.suffix),
    formatTx(item.tx_hash),
  ]
}

/** 释放池日志 → 操作表格行。 */
export function mapReleasePoolLogToRow(item: ReleasePoolLogItem, copy: FlowOpsCopy): FlowLogRow {
  return [
    formatBlockTime(item.event_time),
    releaseAction(item, copy),
    formatAmount(item.amount, 4, ' gAGX'),
    formatTx(item.tx_hash),
  ]
}

/** Turbine 日志 → 操作表格行。 */
export function mapTurbineLogToOpsRow(item: TurbineLogItem, copy: FlowOpsCopy): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    copy.turbine[item.turbine_type] ?? item.turbine_type,
    formatAmount(item.amount, 4, ' gAGX'),
    formatTx(item.tx_hash),
  ]
}

/** 质押持仓 → 侧栏表格行。 */
export function mapStakePositionToAsideRow(item: StakePositionItem, copy: FlowOpsCopy): FlowLogRow {
  const amount = Number(item.amount)
  const amountLabel = formatNumber(Number.isFinite(amount) ? amount : 0, {
    digits: PERSONAL_TOKEN_DIGITS,
    suffix: ' AGX',
  })
  const pct = item.released_pct.trim()
  const pctLabel = pct === '' ? TABLE_EMPTY : `${pct}%`
  const termLabel =
    item.stake_category === 'EARLY'
      ? copy.stake.EARLY_STAKE
      : item.term_days <= 0
        ? copy.liquid
        : interpolate(copy.periodDays, {
            n: formatNumber(item.term_days, { digits: 0, trimZeros: true }),
          })
  return [
    formatBlockTime(item.block_time),
    termLabel,
    amountLabel,
    pctLabel,
    formatTx(item.tx_hash),
  ]
}

/** 债券购买 → 侧栏表格行。 */
export function mapBondPurchaseToAsideRow(item: BondPurchaseItem, copy: FlowOpsCopy): FlowLogRow {
  const discount =
    item.discount_bp == null
      ? TABLE_EMPTY
      : `${formatNumber(item.discount_bp / 100, { digits: 2, trimZeros: true })}%`
  const termLabel =
    item.term_days <= 0
      ? copy.liquid
      : interpolate(copy.periodDays, {
          n: formatNumber(item.term_days, { digits: 0, trimZeros: true }),
        })
  return [
    formatBlockTime(item.block_time),
    termLabel,
    formatAmount(item.deposit_amount, 2, '', '$', true),
    discount,
    formatAmount(item.payout, PERSONAL_TOKEN_DIGITS, ' AGX'),
    formatTx(item.tx_hash),
  ]
}

/** AGX 销毁贡献日志 → 操作表格行。 */
export function mapAgxContributionBurnLogToRow(item: AgxContributionBurnLogItem): FlowLogRow {
  return [
    formatBlockTime(item.block_time),
    formatAmount(item.burned_agx, 4, ' AGX'),
    formatApiContributionPoints(item.contribution_earned),
    formatTx(item.tx_hash),
  ]
}

/** 消耗贡献日志 → 操作表格行。用途：sign_type 优先，否则合约地址；对不上为 TABLE_EMPTY。 */
export function mapAgxContributionConsumeLogToRow(
  item: AgxContributionConsumeLogItem,
  purpose: Record<ConsumeLogPurposeKey, string>,
): FlowLogRow {
  const key = consumeLogPurposeKey(item)
  return [
    formatBlockTime(item.block_time),
    key == null ? TABLE_EMPTY : purpose[key],
    formatAmount(item.claim_amount, 4, ' gAGX'),
    formatApiContributionPoints(item.contribution_consumed),
    formatTx(item.tx_hash),
  ]
}
