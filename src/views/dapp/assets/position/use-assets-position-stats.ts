import { useQuery } from '@tanstack/react-query'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatUsd } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import type { BondPeriod } from '~/core/staking/staking-period'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
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
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export type AssetsPositionStatCell = {
  value: string
  approx?: string
  icon?: 'agx' | 'gagx'
}

function isBondPeriod(value: string): value is BondPeriod {
  return value === '180' || value === '360' || value === '540'
}

function approxUsd(amount: number, priceUsd: number | null): string {
  if (priceUsd == null || priceUsd <= 0 || !Number.isFinite(amount)) return '≈ —'
  return `≈ ${formatUsd(amount * priceUsd, 2)}`
}

function cell(value: string, icon?: 'agx' | 'gagx', approx?: string): AssetsPositionStatCell {
  return { value, icon, approx }
}

/** Right-rail position stats — aggregates existing assets reads (38 §4, no fake numbers). */
export function useAssetsPositionStats(product: AssetsProduct): AssetsPositionStatCell[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const priceUsd =
    agxPriceQuery.isError || agxPriceQuery.data === undefined
      ? null
      : formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS)

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
    return Array.from({ length: 6 }, () => cell('—'))
  }

  if (product === 'stake') {
    if (stakeQuery.isError) return Array.from({ length: 6 }, () => cell('—'))
    if (stakeQuery.data === undefined) return Array.from({ length: 6 }, () => cell('…'))
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
    return [
      cell(
        `${formatTokenAmount(total, AGX_DECIMALS, 2)} AGX`,
        'agx',
        approxUsd(formatTokenAmountToNumber(total, AGX_DECIMALS), priceUsd),
      ),
      cell(
        `${formatTokenAmount(released, AGX_DECIMALS, 2)} AGX`,
        'agx',
        approxUsd(formatTokenAmountToNumber(released, AGX_DECIMALS), priceUsd),
      ),
      cell(
        `${formatTokenAmount(pendingRelease, AGX_DECIMALS, 2)} AGX`,
        'agx',
        approxUsd(formatTokenAmountToNumber(pendingRelease, AGX_DECIMALS), priceUsd),
      ),
      cell(
        `${formatTokenAmount(rebaseReward, GAGX_DECIMALS, 2)} gAGX`,
        'gagx',
        approxUsd(formatTokenAmountToNumber(rebaseReward, GAGX_DECIMALS), priceUsd),
      ),
      cell(
        `${formatTokenAmount(rebaseBonus, GAGX_DECIMALS, 2)} gAGX`,
        'gagx',
        approxUsd(formatTokenAmountToNumber(rebaseBonus, GAGX_DECIMALS), priceUsd),
      ),
      cell(
        `${formatTokenAmount(totalYield, GAGX_DECIMALS, 2)} gAGX`,
        'gagx',
        approxUsd(formatTokenAmountToNumber(totalYield, GAGX_DECIMALS), priceUsd),
      ),
    ]
  }

  if (bondQuery.isError) return Array.from({ length: 6 }, () => cell('—'))
  if (bondQuery.data === undefined)
    return [cell('…'), cell('…'), cell('…'), cell('—'), cell('…'), cell('…')]
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
    cell(`${formatTokenAmount(total, AGX_DECIMALS, 4)} AGX`),
    cell(`${formatTokenAmount(pending, AGX_DECIMALS, 4)} AGX`),
    cell(`${formatTokenAmount(profit, GAGX_DECIMALS, 4)} gAGX`),
    cell('—'),
    cell(discount),
    cell(String(rows.length)),
  ]
}
