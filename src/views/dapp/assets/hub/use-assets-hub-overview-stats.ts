import { useQuery } from '@tanstack/react-query'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatApproxUsd } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import {
  readBurnBondPositions,
  readContributionSnapshot,
  readLpBondPositions,
  readStakePositions,
  readXminePosition,
} from '~/web3/assets/assets-read'
import { readReleaseBufferSnapshot } from '~/web3/release/release-read'
import type { AssetsView } from '~/stores/assets-view-store'

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

export type AssetsHubOverviewModel = {
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
  /** gAGX buffer column — handbook PRV is AGX-only; stay honest. */
  bufferGagxTotal: string
  bufferGagxReleased: string
  modes: Record<'stake' | 'lpbond' | 'burnbond' | 'xmine', AssetsHubModeStats>
}

const EMPTY_MODE: AssetsHubModeStats = {
  aprLabel: '—',
  positionValue: '0.00 AGX',
  positionApprox: formatApproxUsd(0, null),
  yieldValue: '0.00 gAGX',
  yieldApprox: formatApproxUsd(0, null),
}

const EMPTY_XMINE: AssetsHubModeStats = {
  aprLabel: '—',
  positionValue: '0.00 gAGX',
  positionApprox: formatApproxUsd(0, null),
  yieldValue: '0.00 X',
  yieldApprox: formatApproxUsd(0, null),
}

/**
 * Hub overview + per-mode leaf amounts — handbook owners only.
 * Total value / claimed stay honest `—` without cross-product USD quote + cumulative view.
 */
export function useAssetsHubOverviewStats(): AssetsHubOverviewModel {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const enabled = walletReady && Boolean(address)
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const priceUsd =
    agxPriceQuery.isError || agxPriceQuery.data == null
      ? null
      : formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS)

  const stakeQuery = useQuery({
    queryKey: queryKeys.chain.assetsStakePositions(address ?? ''),
    queryFn: () => readStakePositions(address as Address, readClient),
    enabled,
  })
  const lpQuery = useQuery({
    queryKey: queryKeys.chain.assetsBondPositions('lpbond', address ?? ''),
    queryFn: () => readLpBondPositions(address as Address, readClient),
    enabled,
  })
  const burnQuery = useQuery({
    queryKey: queryKeys.chain.assetsBondPositions('burnbond', address ?? ''),
    queryFn: () => readBurnBondPositions(address as Address, readClient),
    enabled,
  })
  const xmineQuery = useQuery({
    queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
    queryFn: () => readXminePosition(address as Address, readClient),
    enabled,
  })
  const contribQuery = useQuery({
    queryKey: [...queryKeys.chain.assetsContribution(address ?? ''), 'hub'],
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled,
  })
  const bufferQuery = useQuery({
    queryKey: queryKeys.chain.releaseBuffer(address ?? ''),
    queryFn: () => readReleaseBufferSnapshot(address as Address, readClient),
    enabled,
  })

  const emptyModes = {
    stake: EMPTY_MODE,
    lpbond: EMPTY_MODE,
    burnbond: EMPTY_MODE,
    xmine: EMPTY_XMINE,
  } as const satisfies Record<Exclude<AssetsView, 'hub'>, AssetsHubModeStats>

  const unavailableOverview = (modes: AssetsHubOverviewModel['modes']): AssetsHubOverviewModel => ({
    totalValue: '—',
    claimable: '—',
    claimableApprox: '≈ —',
    claimed: '—',
    claimedApprox: '≈ —',
    contribution: '—',
    holdingsReleased: '—',
    holdingsReleasedApprox: '≈ —',
    holdingsTotal: '—',
    holdingsTotalApprox: '≈ —',
    bufferTotal: '—',
    bufferTotalApprox: '≈ —',
    bufferReleased: '—',
    bufferReleasedApprox: '≈ —',
    bufferGagxTotal: '—',
    bufferGagxReleased: '—',
    modes,
  })

  if (!enabled) {
    return unavailableOverview(emptyModes)
  }

  const errored =
    stakeQuery.isError ||
    lpQuery.isError ||
    burnQuery.isError ||
    xmineQuery.isError ||
    contribQuery.isError ||
    bufferQuery.isError

  if (errored) {
    return unavailableOverview(emptyModes)
  }

  const loading =
    stakeQuery.data === undefined ||
    lpQuery.data === undefined ||
    burnQuery.data === undefined ||
    xmineQuery.data === undefined ||
    contribQuery.data === undefined ||
    bufferQuery.data === undefined

  if (loading) {
    const pending: AssetsHubModeStats = {
      aprLabel: '—',
      positionValue: '…',
      positionApprox: '≈ —',
      yieldValue: '…',
      yieldApprox: '≈ —',
    }
    return {
      ...unavailableOverview({
        stake: pending,
        lpbond: pending,
        burnbond: pending,
        xmine: pending,
      }),
      claimable: '…',
      contribution: '…',
      holdingsReleased: '…',
      holdingsTotal: '…',
      bufferTotal: '…',
      bufferReleased: '…',
    }
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
    totalValue: '—',
    claimable: claimableParts.length > 0 ? claimableParts.join(' · ') : '0.00 gAGX',
    claimableApprox: formatApproxUsd(claimableGagxNum, priceUsd),
    claimed: '—',
    claimedApprox: '≈ —',
    contribution: formatTokenAmount(contribution, AGX_DECIMALS, 2),
    holdingsReleased: `${formatTokenAmount(stakeReleased, AGX_DECIMALS, 2)} AGX`,
    holdingsReleasedApprox: formatApproxUsd(holdingsReleasedNum, priceUsd),
    holdingsTotal: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
    holdingsTotalApprox: formatApproxUsd(holdingsTotalNum, priceUsd),
    bufferTotal: `${formatTokenAmount(bufferTotal, AGX_DECIMALS, 2)} AGX`,
    bufferTotalApprox: formatApproxUsd(bufferTotalNum, priceUsd),
    bufferReleased: `${formatTokenAmount(bufferReleased, AGX_DECIMALS, 2)} AGX`,
    bufferReleasedApprox: formatApproxUsd(bufferReleasedNum, priceUsd),
    bufferGagxTotal: '—',
    bufferGagxReleased: '—',
    modes: {
      stake: {
        aprLabel: '—',
        positionValue: `${formatTokenAmount(stakePrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(stakePosNum, priceUsd),
        yieldValue: `${formatTokenAmount(stakeYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(stakeYieldNum, priceUsd),
      },
      lpbond: {
        aprLabel: '—',
        positionValue: `${formatTokenAmount(lpPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(lpPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(lpYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(lpYieldNum, priceUsd),
      },
      burnbond: {
        aprLabel: '—',
        positionValue: `${formatTokenAmount(burnPrincipal, AGX_DECIMALS, 2)} AGX`,
        positionApprox: formatApproxUsd(burnPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(burnYield, GAGX_DECIMALS, 2)} gAGX`,
        yieldApprox: formatApproxUsd(burnYieldNum, priceUsd),
      },
      xmine: {
        aprLabel: '—',
        positionValue: `${formatTokenAmount(xStake, GAGX_DECIMALS, 2)} gAGX`,
        positionApprox: formatApproxUsd(xPosNum, priceUsd),
        yieldValue: `${formatTokenAmount(xPending, X_DECIMALS, 2)} X`,
        yieldApprox: formatApproxUsd(formatTokenAmountToNumber(xPending, X_DECIMALS), null),
      },
    },
  }
}
