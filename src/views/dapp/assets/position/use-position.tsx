import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useAppShell } from '~/app/use-app-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBondFlowBurnLogs, useBondFlowLpLogs, useStakeFlowLogs } from '~/hooks/use-api-data'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBondFlowLogToOpsRow, mapStakeFlowLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import type { AssetsSortKey } from '~/views/dapp/assets/primitives'
import type { MixedClaimTarget } from '~/views/dapp/assets/submit-assets'
import { submitBondRedeem, submitStakeRedeem } from '~/views/dapp/assets/submit-assets'
import type { AssetsBondRow, AssetsStakeRow } from '~/web3/assets/assets-read'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
} from '~/web3/assets/assets-read'
import { submitLiquidWarmupClaim } from '~/web3/staking/submit-liquid-warmup-claim'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

/** 仓位卡金额：AGX 单位文案，或 Quote=USD 时用缓存价换算 `$1,300.00`。 */
export function formatAssetsPositionAmount(
  amount: bigint,
  decimals: number,
  quote: 'agx' | 'usd',
  priceUsd: number | null,
  unit: 'AGX' | 'gAGX',
): string {
  if (quote === 'usd') {
    if (priceUsd == null || priceUsd <= 0) return '$0.00'
    return formatGroupedNumber(formatTokenAmountToNumber(amount, decimals) * priceUsd, {
      digits: 2,
      prefix: '$',
    })
  }
  return `${formatTokenAmount(amount, decimals, 2)} ${unit}`
}

export type AssetsProduct = 'stake' | 'lpbond' | 'burnbond'

/** 质押 / 债券仓位链上读取，供持仓列表与右侧统计共用 */
export function useAssetsPositionQueries(product: AssetsProduct) {
  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: product === 'stake',
  })

  const bondQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions(product),
    queryFn: (addr) =>
      product === 'lpbond'
        ? readLpBondPositions(addr as Address)
        : readBurnBondPositions(addr as Address),
    enabled: product !== 'stake',
  })

  return { stakeQuery, bondQuery }
}

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

type ClaimState =
  | { open: false }
  | {
      open: true
      owner: string
      target: MixedClaimTarget
      label: string
      amountLabel: string
    }

type RedeemState =
  | { open: false }
  | {
      open: true
      owner: string
      kind: 'stake' | 'bond'
      row: AssetsStakeRow | AssetsBondRow
      amountLabel: string
    }

type RedeemVars = {
  owner: string
  kind: 'stake' | 'bond'
  row: AssetsStakeRow | AssetsBondRow
}

function stakeSortKey(row: AssetsStakeRow): { start: number; end: number } {
  const end = row.expiry > 0n ? Number(row.expiry) : Number.MAX_SAFE_INTEGER
  const start = row.stakeIndex == null ? Number.MAX_SAFE_INTEGER : row.stakeIndex
  return { start, end }
}

function bondSortKey(row: AssetsBondRow): { start: number; end: number } {
  const end = row.vestingEndTime > 0n ? Number(row.vestingEndTime) : Number.MAX_SAFE_INTEGER
  return { start: row.bondIndex, end }
}

function compareBySort(
  left: { start: number; end: number },
  right: { start: number; end: number },
  sort: AssetsSortKey,
): number {
  switch (sort) {
    case 'startNear':
      return right.start - left.start
    case 'startFar':
      return left.start - right.start
    case 'endNear':
      return left.end - right.end
    case 'endFar':
      return right.end - left.end
  }
}

/**
 * 仓位产品侧栏的状态编排
 *
 * 管理计价币种与排序、持仓分页、领奖与赎回弹窗状态，
 * 并组装链上写交易（赎回、warmup 激活）与成功后失效缓存。
 */
export function usePositionDock(product: AssetsProduct) {
  const { messages: t } = useI18n()
  const { walletReady } = useAppShell()
  const account = useActiveAccount()
  const address = account?.address

  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [sort, setSort] = useState<AssetsSortKey>('startNear')
  const [claim, setClaim] = useState<ClaimState>({ open: false })
  const [redeem, setRedeem] = useState<RedeemState>({ open: false })
  const [page, setPage] = useState(0)

  useEffect(() => {
    setClaim({ open: false })
    setRedeem({ open: false })
  }, [address])

  const copy = t.assets.products[product]
  const stakingTarget: 'stake' | 'lpbond' | 'burnbond' =
    product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize
  const agxPriceUsd = useAgxPriceUsd()

  const sortOptions = useMemo(
    () =>
      (
        ['startNear', 'startFar', 'endNear', 'endFar'] as const satisfies readonly AssetsSortKey[]
      ).map((value) => ({
        value,
        label: t.assets.position.sortOptions[value],
      })),
    [t.assets.position.sortOptions],
  )

  const redeemWrite = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (vars: RedeemVars, session) =>
      vars.kind === 'stake'
        ? submitStakeRedeem({
            session,
            owner: vars.owner,
            row: vars.row as AssetsStakeRow,
          })
        : submitBondRedeem({
            session,
            owner: vars.owner,
            row: vars.row as AssetsBondRow,
          }),
    onSuccess: () => {
      toast.success(t.assets.redeem.success)
      setRedeem({ open: false })
    },
  })

  const { stakeQuery, bondQuery } = useAssetsPositionQueries(product)

  const activateWarmupWrite = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) => submitLiquidWarmupClaim({ session }),
    onSuccess: () => {
      toast.success(t.assets.position.activateWarmupSuccess)
      void stakeQuery.refetch()
    },
  })

  const overviewQuery = useStakingHubOverviewQuery({ enabled: product === 'stake' })
  const currentEpoch = overviewQuery.data?.epochNumber ?? null

  function formatAmount(amount: bigint, decimals: number, unit: 'AGX' | 'gAGX'): string {
    return formatAssetsPositionAmount(amount, decimals, quote, agxPriceUsd, unit)
  }

  function formatPeriodLabel(period: string): string {
    if (period === 'liquid') return t.assets.position.liquid
    return t.assets.claim.releaseDays.replace('{days}', String(period))
  }

  const stakeRows = useMemo(() => {
    const rows = [...(stakeQuery.data ?? [])]
    rows.sort((a, b) => compareBySort(stakeSortKey(a), stakeSortKey(b), sort))
    return rows
  }, [stakeQuery.data, sort])

  const bondRows = useMemo(() => {
    const rows = [...(bondQuery.data ?? [])]
    rows.sort((a, b) => compareBySort(bondSortKey(a), bondSortKey(b), sort))
    return rows
  }, [bondQuery.data, sort])

  const isEmpty = product === 'stake' ? stakeRows.length === 0 : bondRows.length === 0
  const isLoading = product === 'stake' ? stakeQuery.isLoading : bondQuery.isLoading
  const totalRows = product === 'stake' ? stakeRows.length : bondRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageSliceStart = safePage * pageSize
  const pagedStakeRows = stakeRows.slice(pageSliceStart, pageSliceStart + pageSize)
  const pagedBondRows = bondRows.slice(pageSliceStart, pageSliceStart + pageSize)

  function runRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow, owner: string) {
    void redeemWrite.mutate({ kind, row, owner })
  }

  function requestRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (!address) return
    const amount =
      kind === 'stake'
        ? (row as AssetsStakeRow).kind === 'liquid'
          ? (row as AssetsStakeRow).principal
          : (row as AssetsStakeRow).claimableBalance
        : (row as AssetsBondRow).pendingPayout
    const amountLabel = `${formatTokenAmount(amount, EXCHANGE_CONFIG.tokens.agx.decimals, 2)} AGX`
    setRedeem({ open: true, owner: address, kind, row, amountLabel })
  }

  function openStakeClaim(row: AssetsStakeRow) {
    if (!address) return
    if (row.inWarmup) return
    const reward = row.blockReward + row.extraInterest
    const periodLabel = formatPeriodLabel(row.period)
    const target: MixedClaimTarget =
      row.kind === 'liquid'
        ? { source: 'liquid', amount: reward }
        : {
            source: 'locked',
            pool: row.pool,
            stakeIndex: row.stakeIndex!,
            amount: row.blockReward > 0n ? row.blockReward : row.extraInterest,
            extra: row.blockReward <= 0n && row.extraInterest > 0n,
          }
    setClaim({
      open: true,
      owner: address,
      target,
      label: periodLabel,
      amountLabel: `${formatTokenAmount(target.amount, GAGX_DECIMALS, 4)} gAGX`,
    })
  }

  function openBondClaim(row: AssetsBondRow) {
    if (!address) return
    const periodLabel = formatPeriodLabel(String(row.period))
    setClaim({
      open: true,
      owner: address,
      target: {
        source: 'bond',
        depository: row.depository,
        bondIndex: row.bondIndex,
        amount: row.profit,
      },
      label: periodLabel,
      amountLabel: `${formatTokenAmount(row.profit, GAGX_DECIMALS, 4)} gAGX`,
    })
  }

  function closeClaim() {
    setClaim({ open: false })
  }

  function closeRedeem() {
    setRedeem({ open: false })
  }

  function confirmRedeem() {
    if (!redeem.open) return
    runRedeem(redeem.kind, redeem.row, redeem.owner)
  }

  function activateWarmup() {
    void activateWarmupWrite.mutate()
  }

  return {
    product,
    walletReady,
    locked: redeemWrite.isLocked || activateWarmupWrite.isLocked,
    busy: redeemWrite.isPending || activateWarmupWrite.isPending,
    quote,
    setQuote,
    sort,
    setSort,
    sortOptions,
    claim,
    redeem,
    copy,
    stakingTarget,
    pageSize,
    formatAmount,
    formatPeriodLabel,
    currentEpoch,
    isEmpty,
    isLoading,
    totalRows,
    pageCount,
    safePage,
    setPage,
    pagedStakeRows,
    pagedBondRows,
    openStakeClaim,
    openBondClaim,
    requestRedeem,
    activateWarmup,
    closeClaim,
    closeRedeem,
    confirmRedeem,
  }
}

export type AssetsPositionStatCell = {
  value: string
  approx?: string
  icon?: 'agx' | 'gagx'
}

type PricedStat = {
  amount: bigint
  decimals: number
  unit: 'AGX' | 'gAGX'
  icon: NonNullable<AssetsPositionStatCell['icon']>
}

function mapPricedStats(
  rows: readonly PricedStat[],
  priceUsd: number | null,
): AssetsPositionStatCell[] {
  return rows.map(({ amount, decimals, unit, icon }) => ({
    value: `${formatTokenAmount(amount, decimals, 2)} ${unit}`,
    icon,
    approx: formatApproxUsd(formatTokenAmountToNumber(amount, decimals), priceUsd),
  }))
}

/** 读失败展示占位横线，不用 0.00 冒充实数；未连接 / 加载中仍用 0.00 空态 */
function errorStatCells(count: number): AssetsPositionStatCell[] {
  return Array.from({ length: count }, () => ({ value: '—' }))
}

function zeroStatCells(count: number, unit: 'AGX' | 'gAGX' = 'AGX'): AssetsPositionStatCell[] {
  return Array.from({ length: count }, () => ({
    value: `0.00 ${unit}`,
    approx: formatApproxUsd(0, null),
  }))
}

/** 仓位右侧统计：汇总链上持仓数据，读失败展示占位横线，不伪造数字 */
export function useAssetsPositionStats(product: AssetsProduct): AssetsPositionStatCell[] {
  const { walletReady } = useAppShell()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()
  const { stakeQuery, bondQuery } = useAssetsPositionQueries(product)
  const stakeCount = 6
  const bondCount = 5

  if (!walletReady || !address) {
    return zeroStatCells(product === 'stake' ? stakeCount : bondCount)
  }

  if (product === 'stake') {
    if (stakeQuery.isError) return errorStatCells(stakeCount)
    if (stakeQuery.data === undefined) return zeroStatCells(stakeCount)
    const rows = stakeQuery.data
    const total = rows.reduce((sum, row) => sum + row.principal, 0n)
    const released = rows.reduce((sum, row) => sum + row.releasedPrincipal, 0n)
    const pendingRelease = rows.reduce((sum, row) => {
      const left =
        row.principal > row.releasedPrincipal ? row.principal - row.releasedPrincipal : 0n
      return sum + left
    }, 0n)
    const rebaseReward = rows.reduce((sum, row) => sum + row.blockReward, 0n)
    const rebaseBonus = rows.reduce((sum, row) => sum + row.extraInterest, 0n)
    // 质押总收益 = 未领 Rebase 收益 + 加成（gAGX）；不含 claimableBalance（AGX 本金）
    const totalYield = rebaseReward + rebaseBonus
    return mapPricedStats(
      [
        { amount: total, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: released, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: pendingRelease, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: rebaseReward, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
        { amount: rebaseBonus, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
        { amount: totalYield, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
      ],
      priceUsd,
    )
  }

  // LP / Burn：总收益无累计 API → 用「—」占位，不硬编码 0.00
  if (bondQuery.isError) return errorStatCells(bondCount)
  if (bondQuery.data === undefined) return zeroStatCells(bondCount)

  const rows = bondQuery.data
  const total = rows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const released = rows.reduce((sum, row) => sum + row.pendingPayout, 0n)
  const pendingRelease = rows.reduce((sum, row) => {
    const left =
      row.payoutRemaining > row.pendingPayout ? row.payoutRemaining - row.pendingPayout : 0n
    return sum + left
  }, 0n)
  const profit = rows.reduce((sum, row) => sum + row.profit, 0n)

  return [
    ...mapPricedStats(
      [
        { amount: total, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: released, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: pendingRelease, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
        { amount: profit, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
      ],
      priceUsd,
    ),
    { value: '—' },
  ]
}

/** 仓位产品的操作记录：按产品类型拉取对应日志并映射为表格行 */
export function useAssetsPositionOpsRows(product: AssetsProduct) {
  const { sessionReady } = useAppShell()
  const [page, setPage] = useState(1)
  const params = tablePageQuery(page)

  useEffect(() => {
    setPage(1)
  }, [product])

  const stakeLogs = useStakeFlowLogs(params, sessionReady && product === 'stake')
  const lpLogs = useBondFlowLpLogs(params, sessionReady && product === 'lpbond')
  const burnLogs = useBondFlowBurnLogs(params, sessionReady && product === 'burnbond')

  const base = { page, setPage, sessionReady }

  if (product === 'stake') {
    return {
      ...base,
      rows: stakeLogs.data?.items.map(mapStakeFlowLogToOpsRow) ?? [],
      total: stakeLogs.data?.total ?? 0,
      isLoading: sessionReady && stakeLogs.isLoading,
    }
  }
  if (product === 'lpbond') {
    return {
      ...base,
      rows: lpLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
      total: lpLogs.data?.total ?? 0,
      isLoading: sessionReady && lpLogs.isLoading,
    }
  }
  return {
    ...base,
    rows: burnLogs.data?.items.map(mapBondFlowLogToOpsRow) ?? [],
    total: burnLogs.data?.total ?? 0,
    isLoading: sessionReady && burnLogs.isLoading,
  }
}
