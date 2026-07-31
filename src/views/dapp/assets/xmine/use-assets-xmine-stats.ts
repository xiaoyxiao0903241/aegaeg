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
import { readXminePosition } from '~/web3/assets/assets-read'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export type AssetsXmineStatCell = {
  value: string
  approx?: string
  icon?: 'gagx' | 'x'
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

  if (!walletReady || !address || positionQuery.isError) {
    return Array.from({ length: 4 }, () => ({ value: '—' }))
  }
  if (positionQuery.data === undefined) {
    return Array.from({ length: 4 }, () => ({ value: '…' }))
  }

  const { miningStake, pending, warmupGons } = positionQuery.data
  // No gons→amount view: redeemable estimate = full stake after warmup, else 0.
  const released = warmupGons > 0n ? 0n : miningStake

  return [
    ...(
      [
        {
          amount: miningStake,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        {
          amount: released,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        { amount: pending, decimals: X_DECIMALS, unit: 'X', icon: 'x' as const, price: null },
      ] as const
    ).map(({ amount, decimals, unit, icon, price }) => ({
      value: `${formatTokenAmount(amount, decimals, 2)} ${unit}`,
      icon,
      approx: formatApproxUsd(formatTokenAmountToNumber(amount, decimals), price),
    })),
    { value: '—', icon: 'x', approx: '≈ —' },
  ]
}
