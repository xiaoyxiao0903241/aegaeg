import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { BSC_CONTRACTS } from '../config/contracts'
import { formatTokenAmount } from '../lib/swap/token-amount'
import { QUERY_STALE_TIME } from '../lib/query/query-client'
import { queryKeys } from '../lib/query/query-keys'
import { readErc20Balance } from '../web3/swap-read'

export interface WalletTokenBalance {
  symbol: string
  label: string
  value: string
}

export function useWalletTokenBalances(enabled = true) {
  const account = useActiveAccount()
  const address = account?.address

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.walletBalances(address ?? ''),
    queryFn: async () => {
      const [usd1, xx] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, address!),
        readErc20Balance(BSC_CONTRACTS.xxToken, address!),
      ])

      return [
        {
          symbol: 'USD1',
          label: 'USD1',
          value: formatTokenAmount(usd1, 18, 4),
        },
        {
          symbol: 'USDT',
          label: 'XX (USDT)',
          value: formatTokenAmount(xx, 18, 4),
        },
      ] satisfies WalletTokenBalance[]
    },
    enabled: enabled && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  const refresh = async () => {
    await balancesQuery.refetch()
  }

  return {
    balances: balancesQuery.data ?? [],
    isLoading: balancesQuery.isLoading,
    refresh,
  }
}
