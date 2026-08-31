import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  assetsBondSortTimes,
  assetsStakeSortTimes,
  compareAssetsPositionSort,
} from '~/core/assets/assets-position-sort'
import { bondTotalRewardWei } from '~/core/assets/bond-total-reward'
import {
  buildStakeMixedClaimTarget,
  type ClaimOutputKind,
  isStakeRowClaimEnabled,
} from '~/core/assets/claim-output'
import { ZERO_BI } from '~/core/constants'
import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  isAssetsActionableAmount,
  PERSONAL_TOKEN_DIGITS,
} from '~/core/exchange/token-amount'
import { aggregateStakeRelease } from '~/core/staking/aggregate-stake-release'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useBondFlowBurnLogs,
  useBondFlowBurnRewardTotal,
  useBondFlowLpLogs,
  useBondFlowLpRewardTotal,
  useStakeFlowLogs,
} from '~/hooks/use-api-data'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatUsdApprox } from '~/shared/presenters/format'
import {
  mapBondFlowLogToOpsRow,
  mapStakeFlowLogToOpsRow,
} from '~/shared/presenters/map-flow-log-rows'
import {
  ASSETS_SORT_KEYS,
  type AssetsProduct,
  usePositionSessionStore,
} from '~/stores/assets-session-store'
import { useWallClockSec } from '~/stores/wall-clock-store'
import { formatAssetsPositionAmount } from '~/views/dapp/assets/position/format-assets-position-amount'
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
import { WRITE_PATH } from '~/web3/wallet/write-path'

export type { AssetsProduct }

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
      capturedAddress: string
      target: MixedClaimTarget
      label: string
    }

type ClaimOutputState =
  | { open: false }
  | {
      open: true
      capturedAddress: string
      row: AssetsStakeRow
      label: string
    }

type RedeemState =
  | { open: false }
  | {
      open: true
      capturedAddress: string
      kind: 'stake' | 'bond'
      row: AssetsStakeRow | AssetsBondRow
      amountLabel: string
    }

type RedeemVars = {
  capturedAddress: string
  kind: 'stake' | 'bond'
  row: AssetsStakeRow | AssetsBondRow
}

/**
 * 仓位产品侧栏的状态编排
 *
 * 管理计价币种与排序、持仓分页、领奖与赎回弹窗状态，
 * 并组装链上写交易（赎回、warmup 激活）与成功后失效缓存。
 * 报价 / 排序 / 分页在 `usePositionSessionStore`；领奖 / 赎回弹层用本地 `useState`
 *（`AssetsDockBody` 以 product+wallet key remount，随换产品 / 钱包复位）。
 */
export function usePositionDock(product: AssetsProduct) {
  const { messages: t } = useI18n()
  const { walletReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address

  const s = usePositionSessionStore()
  s.syncProduct(product)
  const { quote, setQuote, sort, setSort, page, setPage } = s
  const nowSec = useWallClockSec()
  const [claim, setClaim] = useState<ClaimState>({ open: false })
  const [claimOutput, setClaimOutput] = useState<ClaimOutputState>({ open: false })
  const [redeem, setRedeem] = useState<RedeemState>({ open: false })

  const copy = t.assets.products[product]
  const stakingTarget: 'stake' | 'lpbond' | 'burnbond' =
    product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize
  const agxPriceUsd = useAgxPriceUsd()

  const sortOptions = useMemo(
    () =>
      ASSETS_SORT_KEYS.map((value) => ({
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
            capturedAddress: vars.capturedAddress,
            row: vars.row as AssetsStakeRow,
          })
        : submitBondRedeem({
            session,
            capturedAddress: vars.capturedAddress,
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
  const epochClock = useMemo(
    () =>
      overviewQuery.data
        ? {
            currentEpoch: overviewQuery.data.epochNumber,
            epochEndBlock: overviewQuery.data.epochEndBlock,
            currentBlock: overviewQuery.data.currentBlock,
            epochLengthBlocks: overviewQuery.data.epochLengthBlocks,
            secondsPerBlock: overviewQuery.data.secondsPerBlock,
          }
        : null,
    [overviewQuery.data],
  )

  function formatAmount(amount: bigint, decimals: number, unit: 'AGX' | 'gAGX'): string {
    return formatAssetsPositionAmount(amount, decimals, quote, agxPriceUsd, unit)
  }

  function formatPeriodLabel(period: string): string {
    if (period === 'liquid') return t.assets.position.liquid
    return interpolate(t.assets.claim.releaseDays, { days: period })
  }

  const busy = redeemWrite.isPending || activateWarmupWrite.isPending

  const stakeRows = useMemo(() => {
    const rows = [...(stakeQuery.data ?? [])]
    rows.sort((a, b) =>
      compareAssetsPositionSort(
        assetsStakeSortTimes(a, nowSec, epochClock),
        assetsStakeSortTimes(b, nowSec, epochClock),
        sort,
        a.id,
        b.id,
      ),
    )
    return rows
  }, [epochClock, nowSec, sort, stakeQuery.data])

  const bondRows = useMemo(() => {
    const rows = [...(bondQuery.data ?? [])]
    rows.sort((a, b) =>
      compareAssetsPositionSort(
        assetsBondSortTimes(a, nowSec),
        assetsBondSortTimes(b, nowSec),
        sort,
        a.id,
        b.id,
      ),
    )
    return rows
  }, [bondQuery.data, nowSec, sort])

  const isEmpty = product === 'stake' ? stakeRows.length === 0 : bondRows.length === 0
  const isLoading = product === 'stake' ? stakeQuery.isLoading : bondQuery.isLoading
  const totalRows = product === 'stake' ? stakeRows.length : bondRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageSliceStart = safePage * pageSize
  const pagedStakeRows = stakeRows.slice(pageSliceStart, pageSliceStart + pageSize)
  const pagedBondRows = bondRows.slice(pageSliceStart, pageSliceStart + pageSize)

  function runRedeem(
    kind: 'stake' | 'bond',
    row: AssetsStakeRow | AssetsBondRow,
    capturedAddress: string,
  ) {
    void redeemWrite.mutate({ kind, row, capturedAddress })
  }

  function requestRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (!address) return
    const amount =
      kind === 'stake'
        ? (row as AssetsStakeRow).kind === 'liquid'
          ? (row as AssetsStakeRow).principal
          : (row as AssetsStakeRow).claimableBalance
        : (row as AssetsBondRow).pendingPayout
    const amountLabel = `${formatTokenAmount(amount, EXCHANGE_CONFIG.tokens.agx.decimals, PERSONAL_TOKEN_DIGITS)} AGX`
    setRedeem({ open: true, capturedAddress: address, kind, row, amountLabel })
  }

  function openMixedClaim(args: {
    capturedAddress: string
    target: MixedClaimTarget
    label: string
  }) {
    setClaimOutput({ open: false })
    setClaim({
      open: true,
      capturedAddress: args.capturedAddress,
      target: args.target,
      label: args.label,
    })
  }

  function openStakeClaim(row: AssetsStakeRow) {
    if (!address) return
    if (!isStakeRowClaimEnabled(row, GAGX_DECIMALS)) return
    const periodLabel = formatPeriodLabel(row.period)
    setClaim({ open: false })

    // 活期仅普通奖励入口（手册 claimRewardMixed）；不经产出选择弹层
    if (row.kind === 'liquid') {
      const target = buildStakeMixedClaimTarget({
        stakeKind: 'liquid',
        outputKind: 'reward',
        blockReward: row.blockReward,
        extraInterest: row.extraInterest,
        pool: row.pool,
        stakeIndex: row.stakeIndex,
        decimals: GAGX_DECIMALS,
      })
      if (!target) return
      openMixedClaim({ capturedAddress: address, label: periodLabel, target })
      return
    }

    setClaimOutput({ open: true, capturedAddress: address, row, label: periodLabel })
  }

  function selectClaimOutput(kind: ClaimOutputKind) {
    if (!claimOutput.open) return
    const { capturedAddress, label } = claimOutput
    const row = stakeRows.find((item) => item.id === claimOutput.row.id) ?? claimOutput.row
    const built = buildStakeMixedClaimTarget({
      stakeKind: row.kind === 'liquid' ? 'liquid' : 'locked',
      outputKind: kind,
      blockReward: row.blockReward,
      extraInterest: row.extraInterest,
      pool: row.pool,
      stakeIndex: row.stakeIndex,
      decimals: GAGX_DECIMALS,
    })
    if (!built) return
    openMixedClaim({
      capturedAddress,
      label,
      target: built,
    })
  }

  function openBondClaim(row: AssetsBondRow) {
    if (!address) return
    if (!isAssetsActionableAmount(row.profit, GAGX_DECIMALS)) return
    const periodLabel = formatPeriodLabel(String(row.period))
    openMixedClaim({
      capturedAddress: address,
      label: periodLabel,
      target: {
        source: 'bond',
        depository: row.depository,
        bondIndex: row.bondIndex,
        amount: row.profit,
      },
    })
  }

  function closeClaim() {
    setClaim({ open: false })
  }

  function closeClaimOutput() {
    setClaimOutput({ open: false })
  }

  function closeRedeem() {
    setRedeem({ open: false })
  }

  function confirmRedeem() {
    if (!redeem.open) return
    runRedeem(redeem.kind, redeem.row, redeem.capturedAddress)
  }

  function activateWarmup() {
    void activateWarmupWrite.mutate()
  }

  const liveClaimOutput: ClaimOutputState = claimOutput.open
    ? {
        ...claimOutput,
        row: stakeRows.find((row) => row.id === claimOutput.row.id) ?? claimOutput.row,
      }
    : claimOutput

  return {
    product,
    walletReady,
    busy,
    quote,
    setQuote,
    sort,
    setSort,
    sortOptions,
    claim,
    claimOutput: liveClaimOutput,
    redeem,
    copy,
    stakingTarget,
    pageSize,
    formatAmount,
    formatPeriodLabel,
    epochClock,
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
    selectClaimOutput,
    requestRedeem,
    activateWarmup,
    closeClaim,
    closeClaimOutput,
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
    value: `${formatTokenAmount(amount, decimals, PERSONAL_TOKEN_DIGITS)} ${unit}`,
    icon,
    approx: formatUsdApprox(formatTokenAmountToNumber(amount, decimals), priceUsd),
  }))
}

/** 读失败展示占位横线，不用 0.00 冒充实数；未连接 / 加载中仍用 0.0000 空态 */
function errorStatCells(count: number): AssetsPositionStatCell[] {
  return Array.from({ length: count }, () => ({ value: '—' }))
}

function zeroStatCells(count: number, unit: 'AGX' | 'gAGX' = 'AGX'): AssetsPositionStatCell[] {
  return Array.from({ length: count }, () => ({
    value: `0.0000 ${unit}`,
    approx: formatUsdApprox(0, null),
  }))
}

/** 仓位右侧统计：汇总链上持仓数据，读失败展示占位横线，不伪造数字 */
export function useAssetsPositionStats(product: AssetsProduct): AssetsPositionStatCell[] {
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()
  const { stakeQuery, bondQuery } = useAssetsPositionQueries(product)
  const lpRewardTotalQuery = useBondFlowLpRewardTotal(sessionReady && product === 'lpbond')
  const burnRewardTotalQuery = useBondFlowBurnRewardTotal(sessionReady && product === 'burnbond')
  const stakeCount = 6
  const bondCount = 5

  if (!walletReady || !address) {
    return zeroStatCells(product === 'stake' ? stakeCount : bondCount)
  }

  if (product === 'stake') {
    if (stakeQuery.isError) return errorStatCells(stakeCount)
    if (stakeQuery.data === undefined) return zeroStatCells(stakeCount)
    const rows = stakeQuery.data
    const total = rows.reduce((sum, row) => sum + row.principal, ZERO_BI)
    const { released, pending: pendingRelease } = aggregateStakeRelease(rows)
    const rebaseReward = rows.reduce((sum, row) => sum + row.blockReward, ZERO_BI)
    const rebaseBonus = rows.reduce((sum, row) => sum + row.extraInterest, ZERO_BI)
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

  // LP / 销毁总收益 = 已领接口 + 当前 Rebase（profit）
  if (bondQuery.isError) return errorStatCells(bondCount)
  if (bondQuery.data === undefined) return zeroStatCells(bondCount)

  const rows = bondQuery.data
  const total = rows.reduce((sum, row) => sum + row.payoutRemaining, ZERO_BI)
  const released = rows.reduce((sum, row) => sum + row.pendingPayout, ZERO_BI)
  const pendingRelease = rows.reduce((sum, row) => {
    const left =
      row.payoutRemaining > row.pendingPayout ? row.payoutRemaining - row.pendingPayout : ZERO_BI
    return sum + left
  }, ZERO_BI)
  const profit = rows.reduce((sum, row) => sum + row.profit, ZERO_BI)
  const priced = mapPricedStats(
    [
      { amount: total, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
      { amount: released, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
      { amount: pendingRelease, decimals: AGX_DECIMALS, unit: 'AGX', icon: 'agx' },
      { amount: profit, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' },
    ],
    priceUsd,
  )
  const claimedQuery = product === 'lpbond' ? lpRewardTotalQuery : burnRewardTotalQuery
  const totalYieldWei = bondTotalRewardWei({
    claimedRaw: claimedQuery.error ? null : claimedQuery.data?.total_reward,
    unclaimedWei: profit,
    decimals: GAGX_DECIMALS,
  })
  if (totalYieldWei == null) return [...priced, { value: '—' }]
  return [
    ...priced,
    ...mapPricedStats(
      [{ amount: totalYieldWei, decimals: GAGX_DECIMALS, unit: 'gAGX', icon: 'gagx' }],
      priceUsd,
    ),
  ]
}

/** 仓位产品的操作记录：按产品类型拉取对应日志并映射为表格行 */
export function useAssetsPositionOpsRows(product: AssetsProduct) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const s = usePositionSessionStore()
  s.syncProduct(product)
  const page = s.opsPage
  const setPage = s.setOpsPage
  const params = tablePageQuery(page)
  const ops = t.flowOps

  const stakeLogs = useStakeFlowLogs(params, sessionReady && product === 'stake')
  const lpLogs = useBondFlowLpLogs(params, sessionReady && product === 'lpbond')
  const burnLogs = useBondFlowBurnLogs(params, sessionReady && product === 'burnbond')

  const base = { page, setPage, sessionReady }

  if (product === 'stake') {
    return {
      ...base,
      rows: stakeLogs.data?.items.map((item) => mapStakeFlowLogToOpsRow(item, ops)) ?? [],
      total: stakeLogs.data?.total ?? 0,
      isLoading: sessionReady && stakeLogs.isLoading,
    }
  }
  if (product === 'lpbond') {
    return {
      ...base,
      rows: lpLogs.data?.items.map((item) => mapBondFlowLogToOpsRow(item, ops)) ?? [],
      total: lpLogs.data?.total ?? 0,
      isLoading: sessionReady && lpLogs.isLoading,
    }
  }
  return {
    ...base,
    rows: burnLogs.data?.items.map((item) => mapBondFlowLogToOpsRow(item, ops)) ?? [],
    total: burnLogs.data?.total ?? 0,
    isLoading: sessionReady && burnLogs.isLoading,
  }
}
