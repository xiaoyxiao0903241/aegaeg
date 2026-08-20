import { useState } from 'react'

import { assetsHubNeedsChainFallback } from '~/core/assets/assets-hub-chain-fallback'
import { assetsHubProductReturn, xRewardToGagx } from '~/core/assets/assets-hub-product-return'
import {
  assetsHubPieHoldingsAmount,
  assetsHubTotalValueUsd,
} from '~/core/assets/assets-hub-total-value'
import { ZERO_BI } from '~/core/constants'
import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  parseTokenAmount,
} from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useAssetsHoldingsSummary,
  useAssetsProductInvestReward,
  useAssetsRewardSummary,
} from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import type { Address } from '~/shared/config/contracts'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { buildHoldingsDistributionView } from '~/shared/presenters/build-holdings-distribution'
import {
  formatApiAmount,
  formatNumber,
  formatUsd,
  formatUsdApprox,
  parseApiAmount,
} from '~/shared/presenters/format'
import {
  readBurnBondPositions,
  readContributionSnapshot,
  readLpBondPositions,
  readStakePositions,
  readXminePosition,
} from '~/web3/assets/assets-read'
import { readReleaseBufferSnapshot } from '~/web3/release/release-read'
import { useXmineOverviewQuery } from '~/web3/staking/use-staking-queries'
import { agxAmountPerXFromXPerAgx } from '~/web3/staking/xmine-overview-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals

export type AssetsHubModeStats = {
  aprLabel: string
  positionValue: string
  positionApprox: string
  /** 仓位 USD 估值（持仓分布占比用；无价时 0） */
  positionUsd: number
  yieldValue: string
  yieldApprox: string
  /** 仓位本金（或 X 挖矿 stake/pending）是否非零 — 供「隐藏0资产」筛选。 */
  hasBalance: boolean
}

export type AssetsHubOverview = {
  totalValue: string
  claimable: string
  claimableApprox: string
  claimed: string
  claimedApprox: string
  contribution: string
  holdingsReleased: string
  holdingsReleasedApprox: string
  holdingsTotal: string
  holdingsTotalApprox: string
  bufferTotal: string
  bufferTotalApprox: string
  bufferReleased: string
  bufferReleasedApprox: string
  /**
   * gAGX 缓冲列：分流器快照 gagx 桶（手册 §13）；API 尚未分 token。
   */
  bufferGagxTotal: string
  bufferGagxReleased: string
  modes: Record<'stake' | 'lpbond' | 'burnbond' | 'xmine', AssetsHubModeStats>
  /** 总览 / 持仓分布仍在拉数（骨架用）；未连接钱包为 false */
  overviewLoading: boolean
}

function formatReturnPct(pct: number): string {
  return `${formatNumber(pct, { digits: 2 })}%`
}

/** 无投资或无法计算占比时展示 0.00% */
const APR_EMPTY = formatReturnPct(0)

/** 质押 / 债券：已领(接口) + 未领(链上)，占比分母为实际投资 */
function gagxProductYield(
  bucket: { claimed_reward?: string; invest_amount?: string } | undefined,
  unclaimedWei: bigint,
  priceUsd: number | null,
): Pick<AssetsHubModeStats, 'aprLabel' | 'yieldValue' | 'yieldApprox'> {
  const claimedWei = parseTokenAmount(bucket?.claimed_reward ?? '0', GAGX_DECIMALS)
  const unclaimed = unclaimedWei > 0n ? unclaimedWei : 0n
  const totalWei = claimedWei + unclaimed
  const { pct } = assetsHubProductReturn({
    claimed: formatTokenAmountToNumber(claimedWei, GAGX_DECIMALS),
    unclaimed: formatTokenAmountToNumber(unclaimed, GAGX_DECIMALS),
    invest: parseApiAmount(bucket?.invest_amount) ?? 0,
  })
  return {
    aprLabel: formatReturnPct(pct),
    yieldValue: `${formatTokenAmount(totalWei, GAGX_DECIMALS, 2)} gAGX`,
    yieldApprox: formatUsdApprox(formatTokenAmountToNumber(totalWei, GAGX_DECIMALS), priceUsd),
  }
}

/** X 挖矿：数量用 X；占比把已领 X 按 xPerAgx 折成 gAGX 再加 pendingValue */
function xmineProductYield(
  bucket: { claimed_reward?: string; invest_amount?: string } | undefined,
  pendingWei: bigint,
  pendingValueWei: bigint,
  agxPerX: number,
  priceUsd: number | null,
): Pick<AssetsHubModeStats, 'aprLabel' | 'yieldValue' | 'yieldApprox'> {
  const claimedWei = parseTokenAmount(bucket?.claimed_reward ?? '0', X_DECIMALS)
  const pending = pendingWei > 0n ? pendingWei : 0n
  const totalXWei = claimedWei + pending
  const { pct, totalReward } = assetsHubProductReturn({
    claimed: xRewardToGagx(formatTokenAmountToNumber(claimedWei, X_DECIMALS), agxPerX),
    unclaimed: formatTokenAmountToNumber(
      pendingValueWei > 0n ? pendingValueWei : 0n,
      GAGX_DECIMALS,
    ),
    invest: parseApiAmount(bucket?.invest_amount) ?? 0,
  })
  return {
    aprLabel: formatReturnPct(pct),
    yieldValue: `${formatTokenAmount(totalXWei, X_DECIMALS, 2)} X`,
    yieldApprox: formatUsdApprox(totalReward, priceUsd),
  }
}

function positionUsdOf(amount: number, priceUsd: number | null): number {
  if (!Number.isFinite(amount) || priceUsd == null || priceUsd <= 0) return 0
  return amount * priceUsd
}

const EMPTY_MODE: AssetsHubModeStats = {
  aprLabel: APR_EMPTY,
  positionValue: `${formatNumber(0, { digits: 2 })} AGX`,
  positionApprox: formatUsdApprox(0, null),
  positionUsd: 0,
  yieldValue: `${formatNumber(0, { digits: 2 })} gAGX`,
  yieldApprox: formatUsdApprox(0, null),
  hasBalance: false,
}

const EMPTY_XMINE: AssetsHubModeStats = {
  aprLabel: APR_EMPTY,
  positionValue: `${formatNumber(0, { digits: 2 })} gAGX`,
  positionApprox: formatUsdApprox(0, null),
  positionUsd: 0,
  yieldValue: `${formatNumber(0, { digits: 2 })} X`,
  yieldApprox: formatUsdApprox(0, null),
  hasBalance: false,
}

function formatApiTokenLabel(raw: string | undefined, unit: string, digits = 2): string {
  return `${formatApiAmount(raw, { digits })} ${unit}`
}

function formatApiApproxUsd(raw: string | undefined, priceUsd: number | null): string {
  return formatUsdApprox(parseApiAmount(raw) ?? 0, priceUsd)
}

function modeFromApiAmount(
  amountRaw: string | undefined,
  unit: 'AGX' | 'gAGX',
  priceUsd: number | null,
  aprLabel: string,
  yieldValue: string,
  yieldApprox: string,
): AssetsHubModeStats {
  const amount = parseApiAmount(amountRaw) ?? 0
  return {
    aprLabel,
    positionValue: formatApiTokenLabel(amountRaw, unit),
    positionApprox: formatUsdApprox(amount, priceUsd),
    positionUsd: positionUsdOf(amount, priceUsd),
    yieldValue,
    yieldApprox,
    hasBalance: amount > 0,
  }
}

/**
 * 资产 Hub 总览与各模式持仓数据
 *
 * 已登录会话时优先用后端 API 数据展示；API 缺失时退回链上读取。
 * 未连接、加载中或出错时统一返回 0 值格式化指标。
 */
export function useAssetsHub(): AssetsHubOverview {
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address
  const enabled = walletReady && Boolean(address)
  const priceUsd = useAgxPriceUsd()

  const holdingsSummaryQuery = useAssetsHoldingsSummary(sessionReady)
  const rewardSummaryQuery = useAssetsRewardSummary(sessionReady)
  const distributionQuery = useAssetsHoldingsDistribution(sessionReady)
  const productInvestQuery = useAssetsProductInvestReward(sessionReady)

  const apiHoldings = holdingsSummaryQuery.data
  const apiReward = rewardSummaryQuery.data
  const apiDist = distributionQuery.data
  const apiInvest = productInvestQuery.data
  const apiPending =
    sessionReady &&
    ((holdingsSummaryQuery.isLoading && apiHoldings == null) ||
      (rewardSummaryQuery.isLoading && apiReward == null) ||
      (distributionQuery.isLoading && apiDist == null))
  const apiReady = sessionReady && apiHoldings != null && apiReward != null && apiDist != null
  const chainFallbackEnabled = assetsHubNeedsChainFallback({
    walletReady,
    hasAddress: Boolean(address),
    sessionReady,
    apiPending,
    apiReady,
  })
  // API 就绪时仍读链上仓位，用于未领收益（接口只给已领）
  const chainYieldEnabled = enabled

  const xmineOverviewQuery = useXmineOverviewQuery()
  const agxPerX =
    xmineOverviewQuery.data != null
      ? formatTokenAmountToNumber(
          agxAmountPerXFromXPerAgx(xmineOverviewQuery.data.xPerAgx),
          GAGX_DECIMALS,
        )
      : 0

  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: chainYieldEnabled,
  })
  const lpQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('lpbond'),
    queryFn: (addr) => readLpBondPositions(addr as Address),
    enabled: chainYieldEnabled,
  })
  const burnQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('burnbond'),
    queryFn: (addr) => readBurnBondPositions(addr as Address),
    enabled: chainYieldEnabled,
  })
  const xmineQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
    enabled: chainYieldEnabled,
  })
  const contribQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsContribution,
    queryFn: (addr) => readContributionSnapshot(addr as Address, ZERO_BI),
    enabled: chainFallbackEnabled,
  })
  // gAGX 缓冲以链上分流器快照为准；不能绑 API 回退开关，否则 API 就绪时会恒为 0
  const bufferQuery = useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled,
  })

  const stakeRows = stakeQuery.data ?? []
  const lpRows = lpQuery.data ?? []
  const burnRows = burnQuery.data ?? []
  const xmine = xmineQuery.data
  const chainYieldReady =
    stakeQuery.data !== undefined &&
    lpQuery.data !== undefined &&
    burnQuery.data !== undefined &&
    xmineQuery.data !== undefined
  const stakeYield = chainYieldReady
    ? stakeRows.reduce((sum, row) => sum + row.blockReward + row.extraInterest, ZERO_BI)
    : ZERO_BI
  const lpYield = chainYieldReady ? lpRows.reduce((sum, row) => sum + row.profit, ZERO_BI) : ZERO_BI
  const burnYield = chainYieldReady
    ? burnRows.reduce((sum, row) => sum + row.profit, ZERO_BI)
    : ZERO_BI
  const xPending = chainYieldReady ? (xmine?.pending ?? ZERO_BI) : ZERO_BI
  const xPendingValue = chainYieldReady ? (xmine?.pendingValue ?? ZERO_BI) : ZERO_BI
  const stakeYieldUi = gagxProductYield(apiInvest?.stake, stakeYield, priceUsd)
  const lpYieldUi = gagxProductYield(apiInvest?.lp_bond, lpYield, priceUsd)
  const burnYieldUi = gagxProductYield(apiInvest?.burn_bond, burnYield, priceUsd)
  const xYieldUi = xmineProductYield(
    apiInvest?.x_mining,
    xPending,
    xPendingValue,
    agxPerX,
    priceUsd,
  )

  /** 产品口径「已释放」= 仓位层可领本金（Locked getReleasedPrincipal / Bond pendingPayout） */
  const redeemableReleasedWei = chainYieldReady
    ? stakeRows.reduce((sum, row) => sum + row.releasedPrincipal, ZERO_BI) +
      lpRows.reduce((sum, row) => sum + row.pendingPayout, ZERO_BI) +
      burnRows.reduce((sum, row) => sum + row.pendingPayout, ZERO_BI)
    : null
  const redeemableReleasedNum =
    redeemableReleasedWei != null
      ? formatTokenAmountToNumber(redeemableReleasedWei, AGX_DECIMALS)
      : 0
  const redeemableReleasedLabel =
    redeemableReleasedWei != null
      ? `${formatTokenAmount(redeemableReleasedWei, AGX_DECIMALS, 2)} AGX`
      : `${formatNumber(0, { digits: 2 })} AGX`

  const emptyModes = {
    stake: EMPTY_MODE,
    lpbond: EMPTY_MODE,
    burnbond: EMPTY_MODE,
    xmine: EMPTY_XMINE,
  } as const satisfies Record<Exclude<AssetsView, 'hub'>, AssetsHubModeStats>

  const zeroOverview = (
    modes: AssetsHubOverview['modes'],
    overviewLoading = false,
  ): AssetsHubOverview => ({
    totalValue: formatUsd(0),
    claimable: `${formatNumber(0, { digits: 2 })} gAGX`,
    claimableApprox: formatUsdApprox(0, null),
    claimed: `${formatNumber(0, { digits: 2 })} gAGX`,
    claimedApprox: formatUsdApprox(0, null),
    contribution: formatNumber(0, { digits: 2 }),
    holdingsReleased: `${formatNumber(0, { digits: 2 })} AGX`,
    holdingsReleasedApprox: formatUsdApprox(0, null),
    holdingsTotal: `${formatNumber(0, { digits: 2 })} AGX`,
    holdingsTotalApprox: formatUsdApprox(0, null),
    bufferTotal: `${formatNumber(0, { digits: 2 })} AGX`,
    bufferTotalApprox: formatUsdApprox(0, null),
    bufferReleased: `${formatNumber(0, { digits: 2 })} AGX`,
    bufferReleasedApprox: formatUsdApprox(0, null),
    bufferGagxTotal: `${formatNumber(0, { digits: 2 })} gAGX`,
    bufferGagxReleased: `${formatNumber(0, { digits: 2 })} gAGX`,
    modes,
    overviewLoading,
  })

  if (apiReady) {
    const buffer = bufferQuery.data
    // 单行展示「x.xx gAGX」+ ≈$；金额只取本页 Mixed 可领子集，不能直接显示 API claimable_gagx
    const claimableGagxWei = stakeYield + lpYield + burnYield
    const claimableGagx = `${formatTokenAmount(claimableGagxWei, GAGX_DECIMALS, 2)} gAGX`
    const claimableGagxNum = formatTokenAmountToNumber(claimableGagxWei, GAGX_DECIMALS)
    const piePositions = {
      stake: parseApiAmount(apiDist.stake_total_agx) ?? 0,
      lpbond: parseApiAmount(apiDist.bond_lp) ?? 0,
      burnbond: parseApiAmount(apiDist.bond_burn) ?? 0,
      xmine: parseApiAmount(apiDist.stake_x_pool) ?? 0,
    }
    const holdingsAmount = assetsHubPieHoldingsAmount(piePositions)
    const totalValue = formatUsd(
      assetsHubTotalValueUsd({
        ...piePositions,
        claimable: claimableGagxNum,
        priceUsd,
      }),
    )
    const claimed = `${formatApiDecimalOrZero(apiReward.total_reward_claimed)} gAGX`
    const contribution = formatApiDecimalOrZero(apiReward.available_contribution)
    const holdingsTotal = `${formatNumber(holdingsAmount, { digits: 2 })} AGX`
    // 勿用 API total_released_agx（= 缓冲已提取 + CLAIM_PRINCIPAL 流水），与产品口径「已释放」不符
    const holdingsReleased = redeemableReleasedLabel
    // 钱包就绪且有分流器快照时 AGX/gAGX 缓冲同源链上；否则 AGX 回落 API
    const bufferTotal = buffer
      ? `${formatTokenAmount(buffer.agx.totalRemaining, AGX_DECIMALS, 2)} AGX`
      : formatApiTokenLabel(apiHoldings.buffer_pool_releasing, 'AGX')
    const bufferReleased = buffer
      ? `${formatTokenAmount(buffer.agx.totalClaimed, AGX_DECIMALS, 2)} AGX`
      : formatApiTokenLabel(apiHoldings.buffer_pool_released, 'AGX')
    const bufferTotalApprox = buffer
      ? formatUsdApprox(
          formatTokenAmountToNumber(buffer.agx.totalRemaining, AGX_DECIMALS),
          priceUsd,
        )
      : formatApiApproxUsd(apiHoldings.buffer_pool_releasing, priceUsd)
    const bufferReleasedApprox = buffer
      ? formatUsdApprox(formatTokenAmountToNumber(buffer.agx.totalClaimed, AGX_DECIMALS), priceUsd)
      : formatApiApproxUsd(apiHoldings.buffer_pool_released, priceUsd)

    return {
      totalValue,
      claimable: claimableGagx,
      claimableApprox: formatUsdApprox(claimableGagxNum, priceUsd),
      claimed,
      claimedApprox: formatApiApproxUsd(apiReward.total_reward_claimed, priceUsd),
      contribution,
      holdingsReleased,
      holdingsReleasedApprox: formatUsdApprox(redeemableReleasedNum, priceUsd),
      holdingsTotal,
      holdingsTotalApprox: formatUsdApprox(holdingsAmount, priceUsd),
      bufferTotal,
      bufferTotalApprox,
      bufferReleased,
      bufferReleasedApprox,
      // API 尚未分 token；gAGX 桶以链上分流器快照为准（手册 §13）
      bufferGagxTotal: bufferQuery.isError
        ? '—'
        : `${formatTokenAmount(buffer?.gagx.totalRemaining ?? ZERO_BI, GAGX_DECIMALS, 2)} gAGX`,
      bufferGagxReleased: bufferQuery.isError
        ? '—'
        : `${formatTokenAmount(buffer?.gagx.totalClaimed ?? ZERO_BI, GAGX_DECIMALS, 2)} gAGX`,
      modes: {
        stake: modeFromApiAmount(
          apiDist.stake_total_agx,
          'AGX',
          priceUsd,
          stakeYieldUi.aprLabel,
          stakeYieldUi.yieldValue,
          stakeYieldUi.yieldApprox,
        ),
        lpbond: modeFromApiAmount(
          apiDist.bond_lp,
          'AGX',
          priceUsd,
          lpYieldUi.aprLabel,
          lpYieldUi.yieldValue,
          lpYieldUi.yieldApprox,
        ),
        burnbond: modeFromApiAmount(
          apiDist.bond_burn,
          'AGX',
          priceUsd,
          burnYieldUi.aprLabel,
          burnYieldUi.yieldValue,
          burnYieldUi.yieldApprox,
        ),
        xmine: modeFromApiAmount(
          apiDist.stake_x_pool,
          'gAGX',
          priceUsd,
          xYieldUi.aprLabel,
          xYieldUi.yieldValue,
          xYieldUi.yieldApprox,
        ),
      },
      overviewLoading: false,
    }
  }

  if (apiPending || !enabled) {
    return zeroOverview(emptyModes, Boolean(enabled && apiPending))
  }

  const errored =
    stakeQuery.isError ||
    lpQuery.isError ||
    burnQuery.isError ||
    xmineQuery.isError ||
    contribQuery.isError ||
    bufferQuery.isError

  if (errored) {
    return zeroOverview(emptyModes, false)
  }

  const loading =
    !chainYieldReady || contribQuery.data === undefined || bufferQuery.data === undefined

  if (loading) {
    return zeroOverview(emptyModes, true)
  }

  const stakePrincipal = stakeRows.reduce((sum, row) => sum + row.principal, ZERO_BI)
  const lpPrincipal = lpRows.reduce((sum, row) => sum + row.payoutRemaining, ZERO_BI)
  const burnPrincipal = burnRows.reduce((sum, row) => sum + row.payoutRemaining, ZERO_BI)
  const xStake = xmine?.miningStake ?? ZERO_BI

  const contribution = contribQuery.data?.contribution ?? ZERO_BI
  const buffer = bufferQuery.data
  // 在池总量 = remaining（可领+释放中）；已提取 = claimed（AGX 口径）
  const bufferTotal = buffer?.agx.totalRemaining ?? ZERO_BI
  const bufferReleased = buffer?.agx.totalClaimed ?? ZERO_BI
  const bufferGagxTotal = buffer?.gagx.totalRemaining ?? ZERO_BI
  const bufferGagxReleased = buffer?.gagx.totalClaimed ?? ZERO_BI

  const stakePosNum = formatTokenAmountToNumber(stakePrincipal, AGX_DECIMALS)
  const lpPosNum = formatTokenAmountToNumber(lpPrincipal, AGX_DECIMALS)
  const burnPosNum = formatTokenAmountToNumber(burnPrincipal, AGX_DECIMALS)
  const xPosNum = formatTokenAmountToNumber(xStake, GAGX_DECIMALS)
  const piePositions = {
    stake: stakePosNum,
    lpbond: lpPosNum,
    burnbond: burnPosNum,
    xmine: xPosNum,
  }
  const holdingsAmount = assetsHubPieHoldingsAmount(piePositions)
  const bufferTotalNum = formatTokenAmountToNumber(bufferTotal, AGX_DECIMALS)
  const bufferReleasedNum = formatTokenAmountToNumber(bufferReleased, AGX_DECIMALS)

  const claimableGagxWei = stakeYield + lpYield + burnYield
  const claimableGagxNum = formatTokenAmountToNumber(claimableGagxWei, GAGX_DECIMALS)
  const totalValueUsd = assetsHubTotalValueUsd({
    ...piePositions,
    claimable: claimableGagxNum,
    priceUsd,
  })

  return {
    totalValue: formatUsd(totalValueUsd),
    claimable: `${formatTokenAmount(claimableGagxWei, GAGX_DECIMALS, 2)} gAGX`,
    claimableApprox: formatUsdApprox(claimableGagxNum, priceUsd),
    // 链上无累计已领视图；未加载空结果显示 0.00 gAGX
    claimed: `${formatNumber(0, { digits: 2 })} gAGX`,
    claimedApprox: formatUsdApprox(0, null),
    contribution: formatTokenAmount(contribution, AGX_DECIMALS, 2),
    holdingsReleased: redeemableReleasedLabel,
    holdingsReleasedApprox: formatUsdApprox(redeemableReleasedNum, priceUsd),
    holdingsTotal: `${formatNumber(holdingsAmount, { digits: 2 })} AGX`,
    holdingsTotalApprox: formatUsdApprox(holdingsAmount, priceUsd),
    bufferTotal: `${formatTokenAmount(bufferTotal, AGX_DECIMALS, 2)} AGX`,
    bufferTotalApprox: formatUsdApprox(bufferTotalNum, priceUsd),
    bufferReleased: `${formatTokenAmount(bufferReleased, AGX_DECIMALS, 2)} AGX`,
    bufferReleasedApprox: formatUsdApprox(bufferReleasedNum, priceUsd),
    bufferGagxTotal: `${formatTokenAmount(bufferGagxTotal, GAGX_DECIMALS, 2)} gAGX`,
    bufferGagxReleased: `${formatTokenAmount(bufferGagxReleased, GAGX_DECIMALS, 2)} gAGX`,
    modes: {
      stake: {
        aprLabel: stakeYieldUi.aprLabel,
        positionValue: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(stakePosNum, priceUsd),
        positionUsd: positionUsdOf(stakePosNum, priceUsd),
        yieldValue: stakeYieldUi.yieldValue,
        yieldApprox: stakeYieldUi.yieldApprox,
        hasBalance: stakePrincipal > ZERO_BI || stakeYield > ZERO_BI,
      },
      lpbond: {
        aprLabel: lpYieldUi.aprLabel,
        positionValue: `${formatTokenAmount(lpPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(lpPosNum, priceUsd),
        positionUsd: positionUsdOf(lpPosNum, priceUsd),
        yieldValue: lpYieldUi.yieldValue,
        yieldApprox: lpYieldUi.yieldApprox,
        hasBalance: lpPrincipal > ZERO_BI || lpYield > ZERO_BI,
      },
      burnbond: {
        aprLabel: burnYieldUi.aprLabel,
        positionValue: `${formatTokenAmount(burnPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(burnPosNum, priceUsd),
        positionUsd: positionUsdOf(burnPosNum, priceUsd),
        yieldValue: burnYieldUi.yieldValue,
        yieldApprox: burnYieldUi.yieldApprox,
        hasBalance: burnPrincipal > ZERO_BI || burnYield > ZERO_BI,
      },
      xmine: {
        aprLabel: xYieldUi.aprLabel,
        positionValue: `${formatTokenAmount(xStake, GAGX_DECIMALS, 2)} gAGX`,
        positionApprox: formatUsdApprox(xPosNum, priceUsd),
        positionUsd: positionUsdOf(xPosNum, priceUsd),
        yieldValue: xYieldUi.yieldValue,
        yieldApprox: xYieldUi.yieldApprox,
        hasBalance: xStake > ZERO_BI || xPending > ZERO_BI,
      },
    },
    overviewLoading: false,
  }
}

function formatApiDecimalOrZero(raw: string | undefined): string {
  return formatApiAmount(raw, { digits: 2 })
}

const ZERO_APPROX = formatUsdApprox(0, null)

/**
 * 资产 Hub 详情页状态：汇总总览文案与指标数据，
 * 并管理缓冲币种（AGX / gAGX）切换。
 */
export function useAssetsHubDetail() {
  const { messages: t } = useI18n()
  const overview = t.assets.hub.overview
  const values = useAssetsHub()
  const [bufferAsset, setBufferAsset] = useState<'agx' | 'gagx'>('agx')

  const modeCopy = t.assets.hub.modes
  const distribution = buildHoldingsDistributionView([
    {
      key: 'stake',
      label: modeCopy.stake.title,
      amountLabel: values.modes.stake.positionValue,
      usd: values.modes.stake.positionUsd,
    },
    {
      key: 'lpbond',
      label: modeCopy.lpbond.title,
      amountLabel: values.modes.lpbond.positionValue,
      usd: values.modes.lpbond.positionUsd,
    },
    {
      key: 'burnbond',
      label: modeCopy.burnbond.title,
      amountLabel: values.modes.burnbond.positionValue,
      usd: values.modes.burnbond.positionUsd,
    },
    {
      key: 'xmine',
      label: modeCopy.xmine.title,
      amountLabel: values.modes.xmine.positionValue,
      usd: values.modes.xmine.positionUsd,
    },
  ])

  return {
    t,
    overview,
    rebase: t.assets.hub.rebase,
    values,
    distribution,
    distributionLoading: values.overviewLoading,
    bufferAsset,
    setBufferAsset,
    bufferTotal: bufferAsset === 'agx' ? values.bufferTotal : values.bufferGagxTotal,
    bufferTotalApprox: bufferAsset === 'agx' ? values.bufferTotalApprox : ZERO_APPROX,
    bufferReleased: bufferAsset === 'agx' ? values.bufferReleased : values.bufferGagxReleased,
    bufferReleasedApprox: bufferAsset === 'agx' ? values.bufferReleasedApprox : ZERO_APPROX,
    bufferLabel: bufferAsset === 'agx' ? overview.bufferAssetAgx : overview.bufferAssetGagx,
    bufferIcon: bufferAsset === 'agx' ? tokenCarouselIcons.agxIcon : tokenCarouselIcons.gagxIcon,
  }
}
