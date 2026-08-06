import { useState } from 'react'

import { assetsHubNeedsChainFallback } from '~/core/assets/assets-hub-chain-fallback'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { baseDailyPctFromEpoch, epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useAssetsHoldingsSummary,
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
import {
  useStakingHubOverviewQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'
import { formatXmineDailyYieldLabel } from '~/web3/staking/xmine-overview-read'
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
   * gAGX 缓冲列：PRV 合约仅按 AGX 口径记录，暂无数据来源时保持 0
   *
   * @see docs/onchain-manual/contracts/principalreleasevault.md
   */
  bufferGagxTotal: string
  bufferGagxReleased: string
  modes: Record<'stake' | 'lpbond' | 'burnbond' | 'xmine', AssetsHubModeStats>
}

/** 无 rebase / 挖矿利率时展示 0.00%（空数字→0） */
const APR_EMPTY = `${formatNumber(0, { digits: 2 })}%`

/** epoch rebase → 简易年化 APR（日率 ×365；日率=2×epoch） */
function formatAprFromRebase(rate1e18: bigint | null | undefined): string {
  const daily = baseDailyPctFromEpoch(epochRebasePctFrom1e18(rate1e18))
  if (daily == null) return APR_EMPTY
  return `${formatNumber(daily * 365, { digits: 2 })}%`
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

function formatApiUsdLabel(raw: string | undefined): string {
  return formatApiAmount(raw, { digits: 2, prefix: '$' })
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

  const apiHoldings = holdingsSummaryQuery.data
  const apiReward = rewardSummaryQuery.data
  const apiDist = distributionQuery.data
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
  // API 就绪时仍读链上仓位 / rebase，用于 APR 与未领收益（API 无对应字段）
  const chainYieldEnabled = enabled

  const overviewQuery = useStakingHubOverviewQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const stakeApr = formatAprFromRebase(overviewQuery.data?.rebaseRate1e18)
  const xmineApr =
    xmineOverviewQuery.data != null
      ? formatXmineDailyYieldLabel(xmineOverviewQuery.data.yieldRateBP)
      : APR_EMPTY

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
    queryFn: (addr) => readContributionSnapshot(addr as Address, 0n),
    enabled: chainFallbackEnabled,
  })
  const bufferQuery = useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled: chainFallbackEnabled,
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
    ? stakeRows.reduce((sum, row) => sum + row.blockReward + row.extraInterest, 0n)
    : 0n
  const lpYield = chainYieldReady ? lpRows.reduce((sum, row) => sum + row.profit, 0n) : 0n
  const burnYield = chainYieldReady ? burnRows.reduce((sum, row) => sum + row.profit, 0n) : 0n
  const xPending = chainYieldReady ? (xmine?.pending ?? 0n) : 0n
  const stakeYieldNum = formatTokenAmountToNumber(stakeYield, GAGX_DECIMALS)
  const lpYieldNum = formatTokenAmountToNumber(lpYield, GAGX_DECIMALS)
  const burnYieldNum = formatTokenAmountToNumber(burnYield, GAGX_DECIMALS)
  const xPendingNum = formatTokenAmountToNumber(xPending, X_DECIMALS)

  /** 稿「可赎回已释放」= 仓位层可领本金（Locked getReleasedPrincipal / Bond pendingPayout） */
  const redeemableReleasedWei = chainYieldReady
    ? stakeRows.reduce((sum, row) => sum + row.releasedPrincipal, 0n) +
      lpRows.reduce((sum, row) => sum + row.pendingPayout, 0n) +
      burnRows.reduce((sum, row) => sum + row.pendingPayout, 0n)
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

  const zeroOverview = (modes: AssetsHubOverview['modes']): AssetsHubOverview => ({
    totalValue: formatNumber(0, { digits: 2, prefix: '$' }),
    claimable: `${formatNumber(0, { digits: 2 })} gAGX`,
    claimableApprox: formatUsdApprox(0, null),
    claimed: formatNumber(0, { digits: 2 }),
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
  })

  if (apiReady) {
    const totalValue = formatApiUsdLabel(apiReward.stake_invest_usd_value)
    const claimableGagx = formatApiTokenLabel(apiReward.claimable_gagx, 'gAGX')
    const claimed = formatApiDecimalOrZero(apiReward.total_reward_claimed)
    const contribution = formatApiDecimalOrZero(apiReward.available_contribution)
    const holdingsTotal = formatApiTokenLabel(apiHoldings.total_holdings_agx, 'AGX')
    // 勿用 API total_released_agx（= 缓冲已提取 + CLAIM_PRINCIPAL 流水），与稿「可赎回已释放」不符
    const holdingsReleased = redeemableReleasedLabel
    // 在池总量 = 池内剩余（API releasing）；已提取 = PRINCIPAL_CLAIMED（buffer_pool_released）
    const bufferTotal = formatApiTokenLabel(apiHoldings.buffer_pool_releasing, 'AGX')
    const bufferReleased = formatApiTokenLabel(apiHoldings.buffer_pool_released, 'AGX')
    const stakeYieldLabel = `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX`
    const lpYieldLabel = `${formatTokenAmount(lpYield, GAGX_DECIMALS, 2)} gAGX`
    const burnYieldLabel = `${formatTokenAmount(burnYield, GAGX_DECIMALS, 2)} gAGX`
    const xYieldLabel = `${formatTokenAmount(xPending, X_DECIMALS, 2)} X`

    return {
      totalValue,
      claimable: claimableGagx,
      claimableApprox: formatApiApproxUsd(apiReward.claimable_gagx, priceUsd),
      claimed,
      claimedApprox: formatApiApproxUsd(apiReward.total_reward_claimed, priceUsd),
      contribution,
      holdingsReleased,
      holdingsReleasedApprox: formatUsdApprox(redeemableReleasedNum, priceUsd),
      holdingsTotal,
      holdingsTotalApprox: formatApiApproxUsd(apiHoldings.total_holdings_agx, priceUsd),
      bufferTotal,
      bufferTotalApprox: formatApiApproxUsd(apiHoldings.buffer_pool_releasing, priceUsd),
      bufferReleased,
      bufferReleasedApprox: formatApiApproxUsd(apiHoldings.buffer_pool_released, priceUsd),
      bufferGagxTotal: `${formatNumber(0, { digits: 2 })} gAGX`,
      bufferGagxReleased: `${formatNumber(0, { digits: 2 })} gAGX`,
      modes: {
        stake: modeFromApiAmount(
          apiDist.stake_total_agx,
          'AGX',
          priceUsd,
          stakeApr,
          stakeYieldLabel,
          formatUsdApprox(stakeYieldNum, priceUsd),
        ),
        lpbond: modeFromApiAmount(
          apiDist.bond_lp,
          'AGX',
          priceUsd,
          stakeApr,
          lpYieldLabel,
          formatUsdApprox(lpYieldNum, priceUsd),
        ),
        burnbond: modeFromApiAmount(
          apiDist.bond_burn,
          'AGX',
          priceUsd,
          stakeApr,
          burnYieldLabel,
          formatUsdApprox(burnYieldNum, priceUsd),
        ),
        xmine: modeFromApiAmount(
          apiDist.stake_x_pool,
          'gAGX',
          priceUsd,
          xmineApr,
          xYieldLabel,
          formatUsdApprox(xPendingNum, null),
        ),
      },
    }
  }

  if (apiPending || !enabled) {
    return zeroOverview(emptyModes)
  }

  const errored =
    stakeQuery.isError ||
    lpQuery.isError ||
    burnQuery.isError ||
    xmineQuery.isError ||
    contribQuery.isError ||
    bufferQuery.isError

  if (errored) {
    return zeroOverview(emptyModes)
  }

  const loading =
    !chainYieldReady || contribQuery.data === undefined || bufferQuery.data === undefined

  if (loading) {
    return zeroOverview(emptyModes)
  }

  const stakePrincipal = stakeRows.reduce((sum, row) => sum + row.principal, 0n)
  const lpPrincipal = lpRows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const burnPrincipal = burnRows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const xStake = xmine?.miningStake ?? 0n

  const claimableParts = [
    stakeYield > 0n ? `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX` : null,
    lpYield + burnYield > 0n
      ? `${formatTokenAmount(lpYield + burnYield, GAGX_DECIMALS, 2)} gAGX`
      : null,
    xPending > 0n ? `${formatTokenAmount(xPending, X_DECIMALS, 2)} X` : null,
  ].filter(Boolean)

  const contribution = contribQuery.data?.contribution ?? 0n
  const buffer = bufferQuery.data
  // 在池总量 = remaining（可领+释放中）；已提取 = claimed
  const bufferTotal = buffer?.totalRemaining ?? 0n
  const bufferReleased = buffer?.totalClaimed ?? 0n

  const stakePosNum = formatTokenAmountToNumber(stakePrincipal, AGX_DECIMALS)
  const lpPosNum = formatTokenAmountToNumber(lpPrincipal, AGX_DECIMALS)
  const burnPosNum = formatTokenAmountToNumber(burnPrincipal, AGX_DECIMALS)
  const xPosNum = formatTokenAmountToNumber(xStake, GAGX_DECIMALS)
  // 持仓合计：质押 + LP/Burn 本金 + XMine stake + 缓冲（AGX 口径）
  const holdingsPrincipal = stakePrincipal + lpPrincipal + burnPrincipal + xStake + bufferTotal
  const holdingsTotalNum = formatTokenAmountToNumber(holdingsPrincipal, AGX_DECIMALS)
  const bufferTotalNum = formatTokenAmountToNumber(bufferTotal, AGX_DECIMALS)
  const bufferReleasedNum = formatTokenAmountToNumber(bufferReleased, AGX_DECIMALS)
  const claimableGagxNum = formatTokenAmountToNumber(
    stakeYield + lpYield + burnYield,
    GAGX_DECIMALS,
  )
  const totalValueUsd =
    priceUsd != null && Number.isFinite(priceUsd) ? holdingsTotalNum * priceUsd : 0

  return {
    totalValue: formatNumber(totalValueUsd, { digits: 2, prefix: '$' }),
    claimable:
      claimableParts.length > 0
        ? claimableParts.join(' · ')
        : `${formatNumber(0, { digits: 2 })} gAGX`,
    claimableApprox: formatUsdApprox(claimableGagxNum, priceUsd),
    // 链上无累计已领 view；空结果按产品规则显示 0
    claimed: formatNumber(0, { digits: 2 }),
    claimedApprox: formatUsdApprox(0, null),
    contribution: formatTokenAmount(contribution, AGX_DECIMALS, 2),
    holdingsReleased: redeemableReleasedLabel,
    holdingsReleasedApprox: formatUsdApprox(redeemableReleasedNum, priceUsd),
    holdingsTotal: `${formatTokenAmount(holdingsPrincipal, AGX_DECIMALS, 2)} AGX`,
    holdingsTotalApprox: formatUsdApprox(holdingsTotalNum, priceUsd),
    bufferTotal: `${formatTokenAmount(bufferTotal, AGX_DECIMALS, 2)} AGX`,
    bufferTotalApprox: formatUsdApprox(bufferTotalNum, priceUsd),
    bufferReleased: `${formatTokenAmount(bufferReleased, AGX_DECIMALS, 2)} AGX`,
    bufferReleasedApprox: formatUsdApprox(bufferReleasedNum, priceUsd),
    bufferGagxTotal: `${formatNumber(0, { digits: 2 })} gAGX`,
    bufferGagxReleased: `${formatNumber(0, { digits: 2 })} gAGX`,
    modes: {
      stake: {
        aprLabel: stakeApr,
        positionValue: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(stakePosNum, priceUsd),
        positionUsd: positionUsdOf(stakePosNum, priceUsd),
        yieldValue: `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatUsdApprox(stakeYieldNum, priceUsd),
        hasBalance: stakePrincipal > 0n || stakeYield > 0n,
      },
      lpbond: {
        aprLabel: stakeApr,
        positionValue: `${formatTokenAmount(lpPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(lpPosNum, priceUsd),
        positionUsd: positionUsdOf(lpPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(lpYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatUsdApprox(lpYieldNum, priceUsd),
        hasBalance: lpPrincipal > 0n || lpYield > 0n,
      },
      burnbond: {
        aprLabel: stakeApr,
        positionValue: `${formatTokenAmount(burnPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatUsdApprox(burnPosNum, priceUsd),
        positionUsd: positionUsdOf(burnPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(burnYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatUsdApprox(burnYieldNum, priceUsd),
        hasBalance: burnPrincipal > 0n || burnYield > 0n,
      },
      xmine: {
        aprLabel: xmineApr,
        positionValue: `${formatTokenAmount(xStake, GAGX_DECIMALS, 2)} gAGX`,
        positionApprox: formatUsdApprox(xPosNum, priceUsd),
        positionUsd: positionUsdOf(xPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(xPending, X_DECIMALS, 2)} X`,
        yieldApprox: formatUsdApprox(xPendingNum, null),
        hasBalance: xStake > 0n || xPending > 0n,
      },
    },
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
