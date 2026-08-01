import { useDappShell } from '~/app/use-dapp-shell'
import { assetsHubNeedsChainFallback } from '~/core/assets/assets-hub-chain-fallback'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  useAssetsHoldingsDistribution,
  useAssetsHoldingsSummary,
  useAssetsRewardSummary,
} from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  readBurnBondPositions,
  readContributionSnapshot,
  readLpBondPositions,
  readStakePositions,
  readXminePosition,
} from '~/web3/assets/assets-read'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import { readReleaseBufferSnapshot } from '~/web3/release/release-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export type AssetsHubModeStats = {
  aprLabel: string
  positionValue: string
  positionApprox: string
  yieldValue: string
  yieldApprox: string
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
  /** gAGX buffer column — handbook PRV is AGX-only; stay zero until sourced. */
  bufferGagxTotal: string
  bufferGagxReleased: string
  modes: Record<'stake' | 'lpbond' | 'burnbond' | 'xmine', AssetsHubModeStats>
}

const EMPTY_MODE: AssetsHubModeStats = {
  aprLabel: '0%',
  positionValue: `${formatGroupedNumber(0, { digits: 2 })} AGX`,
  positionApprox: formatApproxUsd(0, null),
  yieldValue: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
  yieldApprox: formatApproxUsd(0, null),
}

const EMPTY_XMINE: AssetsHubModeStats = {
  aprLabel: '0%',
  positionValue: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
  positionApprox: formatApproxUsd(0, null),
  yieldValue: `${formatGroupedNumber(0, { digits: 2 })} X`,
  yieldApprox: formatApproxUsd(0, null),
}

function formatApiTokenLabel(raw: string | undefined, unit: string, digits = 2): string {
  if (raw == null || raw.trim() === '') return `${formatGroupedNumber(0, { digits })} ${unit}`
  const n = Number(raw)
  if (!Number.isFinite(n)) return `${formatGroupedNumber(0, { digits })} ${unit}`
  return `${formatGroupedNumber(n, { digits })} ${unit}`
}

function formatApiUsdLabel(raw: string | undefined): string {
  if (raw == null || raw.trim() === '') return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  const n = Number(raw)
  if (!Number.isFinite(n)) return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  return formatGroupedNumber(n, { digits: 2, prefix: '$' })
}

function formatApiApproxUsd(raw: string | undefined, priceUsd: number | null): string {
  if (raw == null || raw.trim() === '') return formatApproxUsd(0, null)
  const n = Number(raw)
  if (!Number.isFinite(n)) return formatApproxUsd(0, null)
  return formatApproxUsd(n, priceUsd)
}

function modeFromApiAmount(
  amountRaw: string | undefined,
  unit: 'AGX' | 'gAGX',
  priceUsd: number | null,
): AssetsHubModeStats {
  const n = amountRaw != null ? Number(amountRaw) : Number.NaN
  const amount = Number.isFinite(n) ? n : 0
  return {
    aprLabel: '0%',
    positionValue: formatApiTokenLabel(amountRaw, unit),
    positionApprox: formatApproxUsd(amount, priceUsd),
    yieldValue:
      unit === 'AGX'
        ? `${formatGroupedNumber(0, { digits: 2 })} gAGX`
        : `${formatGroupedNumber(0, { digits: 2 })} X`,
    yieldApprox: formatApproxUsd(0, null),
  }
}

/**
 * Hub overview + per-mode leaf amounts.
 * sessionReady + API data wins for display; chain remains fallback / write-adjacent.
 * Empty / pending / error → zero-formatted metrics (prototype 无数据).
 */
export function useAssetsHubOverviewStats(): AssetsHubOverview {
  const { walletReady, sessionReady } = useDappShell()
  const account = useActiveAccount()
  const address = account?.address
  const enabled = walletReady && Boolean(address)
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const priceUsd =
    agxPriceQuery.isError || agxPriceQuery.data == null
      ? null
      : formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS)

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

  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: chainFallbackEnabled,
  })
  const lpQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('lpbond'),
    queryFn: (addr) => readLpBondPositions(addr as Address),
    enabled: chainFallbackEnabled,
  })
  const burnQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('burnbond'),
    queryFn: (addr) => readBurnBondPositions(addr as Address),
    enabled: chainFallbackEnabled,
  })
  const xmineQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
    enabled: chainFallbackEnabled,
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

  const emptyModes = {
    stake: EMPTY_MODE,
    lpbond: EMPTY_MODE,
    burnbond: EMPTY_MODE,
    xmine: EMPTY_XMINE,
  } as const satisfies Record<Exclude<AssetsView, 'hub'>, AssetsHubModeStats>

  const zeroOverview = (modes: AssetsHubOverview['modes']): AssetsHubOverview => ({
    totalValue: formatGroupedNumber(0, { digits: 2, prefix: '$' }),
    claimable: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    claimableApprox: formatApproxUsd(0, null),
    claimed: formatGroupedNumber(0, { digits: 2 }),
    claimedApprox: formatApproxUsd(0, null),
    contribution: formatGroupedNumber(0, { digits: 2 }),
    holdingsReleased: `${formatGroupedNumber(0, { digits: 2 })} AGX`,
    holdingsReleasedApprox: formatApproxUsd(0, null),
    holdingsTotal: `${formatGroupedNumber(0, { digits: 2 })} AGX`,
    holdingsTotalApprox: formatApproxUsd(0, null),
    bufferTotal: `${formatGroupedNumber(0, { digits: 2 })} AGX`,
    bufferTotalApprox: formatApproxUsd(0, null),
    bufferReleased: `${formatGroupedNumber(0, { digits: 2 })} AGX`,
    bufferReleasedApprox: formatApproxUsd(0, null),
    bufferGagxTotal: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    bufferGagxReleased: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    modes,
  })

  if (apiReady) {
    const totalValue = formatApiUsdLabel(apiReward.stake_invest_usd_value)
    const claimableGagx = formatApiTokenLabel(apiReward.claimable_gagx, 'gAGX')
    const claimed = formatApiDecimalOrZero(apiReward.total_reward_claimed)
    const contribution = formatApiDecimalOrZero(apiReward.available_contribution)
    const holdingsTotal = formatApiTokenLabel(apiHoldings.total_holdings_agx, 'AGX')
    const holdingsReleased = formatApiTokenLabel(apiHoldings.total_released_agx, 'AGX')
    const bufferTotal = formatApiTokenLabel(apiHoldings.buffer_pool_cumulative, 'AGX')
    const bufferReleased = formatApiTokenLabel(apiHoldings.buffer_pool_released, 'AGX')

    return {
      totalValue,
      claimable: claimableGagx,
      claimableApprox: formatApiApproxUsd(apiReward.claimable_gagx, priceUsd),
      claimed,
      claimedApprox: formatApiApproxUsd(apiReward.total_reward_claimed, priceUsd),
      contribution,
      holdingsReleased,
      holdingsReleasedApprox: formatApiApproxUsd(apiHoldings.total_released_agx, priceUsd),
      holdingsTotal,
      holdingsTotalApprox: formatApiApproxUsd(apiHoldings.total_holdings_agx, priceUsd),
      bufferTotal,
      bufferTotalApprox: formatApiApproxUsd(apiHoldings.buffer_pool_cumulative, priceUsd),
      bufferReleased,
      bufferReleasedApprox: formatApiApproxUsd(apiHoldings.buffer_pool_released, priceUsd),
      bufferGagxTotal: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
      bufferGagxReleased: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
      modes: {
        stake: modeFromApiAmount(apiDist.stake_total_agx, 'AGX', priceUsd),
        lpbond: modeFromApiAmount(apiDist.bond_lp, 'AGX', priceUsd),
        burnbond: modeFromApiAmount(apiDist.bond_burn, 'AGX', priceUsd),
        xmine: {
          ...modeFromApiAmount(apiDist.stake_x_pool, 'gAGX', priceUsd),
          yieldValue: `${formatGroupedNumber(0, { digits: 2 })} X`,
          yieldApprox: formatApproxUsd(0, null),
        },
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
    stakeQuery.data === undefined ||
    lpQuery.data === undefined ||
    burnQuery.data === undefined ||
    xmineQuery.data === undefined ||
    contribQuery.data === undefined ||
    bufferQuery.data === undefined

  if (loading) {
    return zeroOverview(emptyModes)
  }

  const stakeRows = stakeQuery.data ?? []
  const lpRows = lpQuery.data ?? []
  const burnRows = burnQuery.data ?? []
  const xmine = xmineQuery.data

  const stakePrincipal = stakeRows.reduce((sum, row) => sum + row.principal, 0n)
  const stakeReleased = stakeRows.reduce((sum, row) => sum + row.releasedPrincipal, 0n)
  const stakeYield = stakeRows.reduce(
    (sum, row) => sum + row.blockReward + row.extraInterest + row.claimableBalance,
    0n,
  )
  const lpPrincipal = lpRows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const lpYield = lpRows.reduce((sum, row) => sum + row.profit, 0n)
  const burnPrincipal = burnRows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const burnYield = burnRows.reduce((sum, row) => sum + row.profit, 0n)
  const xStake = xmine?.miningStake ?? 0n
  const xPending = xmine?.pending ?? 0n

  const claimableParts = [
    stakeYield > 0n ? `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX` : null,
    lpYield + burnYield > 0n
      ? `${formatTokenAmount(lpYield + burnYield, GAGX_DECIMALS, 2)} gAGX`
      : null,
    xPending > 0n ? `${formatTokenAmount(xPending, X_DECIMALS, 2)} X` : null,
  ].filter(Boolean)

  const contribution = contribQuery.data?.contribution ?? 0n
  const buffer = bufferQuery.data
  const bufferTotal = buffer?.totalAmount ?? 0n
  const bufferReleased = buffer?.totalClaimed ?? 0n

  const stakePosNum = formatTokenAmountToNumber(stakePrincipal, AGX_DECIMALS)
  const stakeYieldNum = formatTokenAmountToNumber(stakeYield, GAGX_DECIMALS)
  const lpPosNum = formatTokenAmountToNumber(lpPrincipal, AGX_DECIMALS)
  const lpYieldNum = formatTokenAmountToNumber(lpYield, GAGX_DECIMALS)
  const burnPosNum = formatTokenAmountToNumber(burnPrincipal, AGX_DECIMALS)
  const burnYieldNum = formatTokenAmountToNumber(burnYield, GAGX_DECIMALS)
  const xPosNum = formatTokenAmountToNumber(xStake, GAGX_DECIMALS)
  const holdingsTotalNum = formatTokenAmountToNumber(stakePrincipal, AGX_DECIMALS)
  const holdingsReleasedNum = formatTokenAmountToNumber(stakeReleased, AGX_DECIMALS)
  const bufferTotalNum = formatTokenAmountToNumber(bufferTotal, AGX_DECIMALS)
  const bufferReleasedNum = formatTokenAmountToNumber(bufferReleased, AGX_DECIMALS)
  const claimableGagxNum = formatTokenAmountToNumber(
    stakeYield + lpYield + burnYield,
    GAGX_DECIMALS,
  )

  return {
    totalValue: formatGroupedNumber(0, { digits: 2, prefix: '$' }),
    claimable:
      claimableParts.length > 0
        ? claimableParts.join(' · ')
        : `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    claimableApprox: formatApproxUsd(claimableGagxNum, priceUsd),
    claimed: formatGroupedNumber(0, { digits: 2 }),
    claimedApprox: formatApproxUsd(0, null),
    contribution: formatTokenAmount(contribution, AGX_DECIMALS, 2),
    holdingsReleased: `${formatTokenAmount(stakeReleased, AGX_DECIMALS, 2)} AGX`,
    holdingsReleasedApprox: formatApproxUsd(holdingsReleasedNum, priceUsd),
    holdingsTotal: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
    holdingsTotalApprox: formatApproxUsd(holdingsTotalNum, priceUsd),
    bufferTotal: `${formatTokenAmount(bufferTotal, AGX_DECIMALS, 2)} AGX`,
    bufferTotalApprox: formatApproxUsd(bufferTotalNum, priceUsd),
    bufferReleased: `${formatTokenAmount(bufferReleased, AGX_DECIMALS, 2)} AGX`,
    bufferReleasedApprox: formatApproxUsd(bufferReleasedNum, priceUsd),
    bufferGagxTotal: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    bufferGagxReleased: `${formatGroupedNumber(0, { digits: 2 })} gAGX`,
    modes: {
      stake: {
        aprLabel: '0%',
        positionValue: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(stakePosNum, priceUsd),
        yieldValue: `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(stakeYieldNum, priceUsd),
      },
      lpbond: {
        aprLabel: '0%',
        positionValue: `${formatTokenAmount(lpPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(lpPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(lpYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(lpYieldNum, priceUsd),
      },
      burnbond: {
        aprLabel: '0%',
        positionValue: `${formatTokenAmount(burnPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(burnPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(burnYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(burnYieldNum, priceUsd),
      },
      xmine: {
        aprLabel: '0%',
        positionValue: `${formatTokenAmount(xStake, GAGX_DECIMALS, 2)} gAGX`,
        positionApprox: formatApproxUsd(xPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(xPending, X_DECIMALS, 2)} X`,
        yieldApprox: formatApproxUsd(formatTokenAmountToNumber(xPending, X_DECIMALS), null),
      },
    },
  }
}

function formatApiDecimalOrZero(raw: string | undefined): string {
  if (raw == null || raw.trim() === '') return formatGroupedNumber(0, { digits: 2 })
  const n = Number(raw)
  if (!Number.isFinite(n)) return formatGroupedNumber(0, { digits: 2 })
  return formatGroupedNumber(n, { digits: 2 })
}
