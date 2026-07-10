import { useQuery } from '@tanstack/react-query'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { readErc20Balance, readErc20Allowance } from '~/views/dapp/web3/swap-read'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useChainReadClient } from '~/views/dapp/web3/use-chain-read-client'

type UseSwapBalancesArgs = {
  address: string | undefined
  sellAddress: `0x${string}`
  buyAddress: `0x${string}`
  quotesEnabled: boolean
  walletReady: boolean
}

/** ERC20 sell/buy balances + router allowance for the active trade pair. */
export function useSwapBalances({
  address,
  sellAddress,
  buyAddress,
  quotesEnabled,
  walletReady,
}: UseSwapBalancesArgs) {
  const readClient = useChainReadClient()

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.swapBalances(address ?? '', sellAddress, buyAddress),
    queryFn: async () => {
      const owner = address!
      const [sell, buy, approved] = await Promise.all([
        readErc20Balance(sellAddress, owner, readClient),
        readErc20Balance(buyAddress, owner, readClient),
        readErc20Allowance(sellAddress, owner, SWAP_CONFIG.router, readClient),
      ])
      return { sell, buy, approved }
    },
    enabled: quotesEnabled && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  return {
    balancesQuery,
    sellBalance: balancesQuery.data?.sell ?? 0n,
    buyBalance: balancesQuery.data?.buy ?? 0n,
    allowance: balancesQuery.data?.approved ?? 0n,
    balancesLoaded: balancesQuery.data !== undefined,
    isBalancesLoading: walletReady && balancesQuery.isLoading,
  }
}
