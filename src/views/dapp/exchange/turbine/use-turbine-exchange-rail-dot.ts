import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readTurbineHasClaimable } from '~/web3/exchange/turbine-exchange-read'

/** EX-U4: exchange rail red-dot when Turbine has vested claimable rows. */
export function useTurbineExchangeRailDot(enabled: boolean) {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const walletReady = hasWalletAccount(account)
  const address = account?.address

  const query = useQuery({
    queryKey: queryKeys.chain.turbineClaimable(address ?? ''),
    queryFn: () => readTurbineHasClaimable(address!, readClient),
    enabled: enabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  return Boolean(query.data)
}
