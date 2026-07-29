import { useQuery } from '@tanstack/react-query'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatUsd } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readXminePosition } from '~/web3/assets/assets-read'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export type AssetsXmineStatCell = {
  value: string
  approx?: string
  icon?: 'gagx' | 'x'
}

function approxUsd(amount: number, priceUsd: number | null): string {
  if (priceUsd == null || priceUsd <= 0 || !Number.isFinite(amount)) return '≈ —'
  return `≈ ${formatUsd(amount * priceUsd, 2)}`
}

function cell(value: string, icon?: 'gagx' | 'x', approx?: string): AssetsXmineStatCell {
  return { value, icon, approx }
}

/** Right-rail Xmine stats — `readXminePosition` only; total mined DEFER-数据. */
export function useAssetsXmineStats(): AssetsXmineStatCell[] {
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const priceUsd =
    agxPriceQuery.isError || agxPriceQuery.data === undefined
      ? null
      : formatTokenAmountToNumber(agxPriceQuery.data, USD1_DECIMALS)

  const positionQuery = useQuery({
    queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
    queryFn: () => readXminePosition(address as Address, readClient),
    enabled: walletReady && Boolean(address),
  })

  const dash = [cell('—'), cell('—'), cell('—'), cell('—')]
  if (!walletReady || !address) return dash
  if (positionQuery.isError) return dash
  if (positionQuery.data === undefined) {
    return [cell('…'), cell('…'), cell('…'), cell('…')]
  }

  const { miningStake, pending, warmupGons } = positionQuery.data
  // No gons→amount view: redeemable estimate = full stake after warmup, else 0.
  const released = warmupGons > 0n ? 0n : miningStake
  const stakeNum = formatTokenAmountToNumber(miningStake, GAGX_DECIMALS)
  const releasedNum = formatTokenAmountToNumber(released, GAGX_DECIMALS)

  return [
    cell(
      `${formatTokenAmount(miningStake, GAGX_DECIMALS, 2)} gAGX`,
      'gagx',
      approxUsd(stakeNum, priceUsd),
    ),
    cell(
      `${formatTokenAmount(released, GAGX_DECIMALS, 2)} gAGX`,
      'gagx',
      approxUsd(releasedNum, priceUsd),
    ),
    cell(`${formatTokenAmount(pending, X_DECIMALS, 2)} X`, 'x', '≈ —'),
    cell('—', 'x', '≈ —'),
  ]
}
