import { useQuery } from '@tanstack/react-query'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { readErc20Balance, readErc20Allowance } from '~/web3/exchange/exchange-read'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useChainReadClient } from '~/web3/use-chain-read-client'

type UseMarketTradeBalancesArgs = {
  address: string | undefined
  sellAddress: `0x${string}`
  buyAddress: `0x${string}`
  quotesEnabled: boolean
  walletReady: boolean
}

/** ERC20 sell/buy balances + router allowance for the active trade pair. */
export function useMarketTradeBalances({
  address,
  sellAddress,
  buyAddress,
  quotesEnabled,
  walletReady,
}: UseMarketTradeBalancesArgs) {
  const readClient = useChainReadClient()

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.swapBalances(address ?? '', sellAddress, buyAddress),
    queryFn: async () => {
      const owner = address!
      const [sell, buy, approved] = await Promise.all([
        readErc20Balance(sellAddress, owner, readClient),
        readErc20Balance(buyAddress, owner, readClient),
        readErc20Allowance(sellAddress, owner, EXCHANGE_CONFIG.router, readClient),
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
