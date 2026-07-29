import { useQuery } from '@tanstack/react-query'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import type { BondPeriod } from '~/core/staking/staking-period'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
} from '~/web3/assets/assets-read'
import { formatBondDiscountLabel, readBondMarketMeta } from '~/web3/staking/staking-read'
import {
  resolveBurnBondDepository,
  resolveLpBondDepository,
} from '~/web3/staking/resolve-staking-addresses'
import type { AssetsProduct } from '~/views/dapp/assets/position/assets-position-widget'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

function isBondPeriod(value: string): value is BondPeriod {
  return value === '180' || value === '360' || value === '540'
}

/** Right-rail position stats — aggregates existing assets reads (38 §4, no fake numbers). */
export function useAssetsPositionStats(product: AssetsProduct): string[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const stakeQuery = useQuery({
    queryKey: queryKeys.chain.assetsStakePositions(address ?? ''),
    queryFn: () => readStakePositions(address as Address, readClient),
    enabled: walletReady && Boolean(address) && product === 'stake',
  })

  const bondQuery = useQuery({
    queryKey: queryKeys.chain.assetsBondPositions(product, address ?? ''),
    queryFn: () =>
      product === 'lpbond'
        ? readLpBondPositions(address as Address, readClient)
        : readBurnBondPositions(address as Address, readClient),
    enabled: walletReady && Boolean(address) && product !== 'stake',
  })

  const bondRows = bondQuery.data ?? []
  const uniquePeriods = [...new Set(bondRows.map((row) => row.period).filter(isBondPeriod))]
  const discountPeriod = uniquePeriods.length === 1 ? uniquePeriods[0] : null
  const sampleDepository =
    discountPeriod == null
      ? null
      : product === 'lpbond'
        ? resolveLpBondDepository(discountPeriod)
        : resolveBurnBondDepository(discountPeriod)

  const discountQuery = useQuery({
    queryKey: queryKeys.chain.bondMarketMeta(sampleDepository ?? 'none'),
    queryFn: () => readBondMarketMeta(sampleDepository!, readClient),
    enabled: product !== 'stake' && sampleDepository != null,
    staleTime: 60_000,
  })

  if (!walletReady || !address) {
    return ['—', '—', '—', '—', '—', '—']
  }

  if (product === 'stake') {
    if (stakeQuery.isError) return ['—', '—', '—', '—', '—', '—']
    if (stakeQuery.data === undefined) return ['…', '…', '…', '…', '…', '…']
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
    const totalYield = rows.reduce(
      (sum, row) => sum + row.blockReward + row.extraInterest + row.claimableBalance,
      0n,
    )
    return [
      `${formatTokenAmount(total, AGX_DECIMALS, 4)} AGX`,
      `${formatTokenAmount(released, AGX_DECIMALS, 4)} AGX`,
      `${formatTokenAmount(pendingRelease, AGX_DECIMALS, 4)} AGX`,
      `${formatTokenAmount(rebaseReward, GAGX_DECIMALS, 4)} gAGX`,
      `${formatTokenAmount(rebaseBonus, GAGX_DECIMALS, 4)} gAGX`,
      `${formatTokenAmount(totalYield, GAGX_DECIMALS, 4)} gAGX`,
    ]
  }

  if (bondQuery.isError) return ['—', '—', '—', '—', '—', '—']
  if (bondQuery.data === undefined) return ['…', '…', '…', '—', '…', '…']
  const rows = bondQuery.data
  const total = rows.reduce((sum, row) => sum + row.payoutRemaining, 0n)
  const pending = rows.reduce((sum, row) => sum + row.pendingPayout, 0n)
  const profit = rows.reduce((sum, row) => sum + row.profit, 0n)

  let discount = '—'
  if (discountPeriod != null) {
    if (discountQuery.isError) {
      discount = '—'
    } else if (discountQuery.data === undefined) {
      discount = '…'
    } else {
      discount = formatBondDiscountLabel(discountQuery.data.discountRateBP)
    }
  }

  return [
    `${formatTokenAmount(total, AGX_DECIMALS, 4)} AGX`,
    `${formatTokenAmount(pending, AGX_DECIMALS, 4)} AGX`,
    `${formatTokenAmount(profit, GAGX_DECIMALS, 4)} gAGX`,
    '—',
    discount,
    String(rows.length),
  ]
}
